from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..services.partidos import obtener_partidos_inicio

from ..models import PartidoReal, Prediccion, Participante
from ..permissions import IsAdminOrReadOnly
from ..serializers import PartidoRealSerializer, PartidoRealDetailSerializer
from datetime import date

class PartidoRealListCreateView(generics.ListCreateAPIView):
    queryset = PartidoReal.objects.all()
    serializer_class = PartidoRealSerializer
    permission_classes = [IsAdminOrReadOnly]

class PartidoRealDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PartidoReal.objects.select_related(
        "equipo_local",
        "equipo_visitante",
    ).prefetch_related(
        "predicciones__participante",
    )
    serializer_class = PartidoRealDetailSerializer
    permission_classes = [IsAdminOrReadOnly]

class PartidosInicioView(generics.GenericAPIView):
    serializer_class = PartidoRealSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, *args, **kwargs):
        datos = obtener_partidos_inicio()

        return Response({
            "tipo": datos["tipo"],
            "fecha": (
                datos["fecha"].isoformat()
                if datos["fecha"] is not None
                else None
            ),
            "partidos": self.get_serializer(
                datos["partidos"],
                many=True,
            ).data,
        })


class EditarPartidoCompletoView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    @transaction.atomic
    def post(self, request, pk):
        try:
            partido = PartidoReal.objects.select_for_update().get(pk=pk)
        except PartidoReal.DoesNotExist:
            return Response(
                {"detail": "El partido no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        datos = request.data
        goles_local = datos.get("goles_local")
        goles_visitante = datos.get("goles_visitante")
        predicciones = datos.get("predicciones")

        if not isinstance(predicciones, list):
            return Response(
                {"predicciones": "Debe enviarse una lista de predicciones."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        def validar_goles(valor):
            return (
                valor is None
                or (
                    isinstance(valor, int)
                    and not isinstance(valor, bool)
                    and valor >= 0
                )
            )

        if not validar_goles(goles_local) or not validar_goles(goles_visitante):
            return Response(
                {"detail": "Los goles deben ser enteros no negativos o nulos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (goles_local is None) != (goles_visitante is None):
            return Response(
                {"detail": "El marcador debe tener ambos goles o ninguno."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ids_participantes = []
        for item in predicciones:
            if not isinstance(item, dict):
                return Response(
                    {"predicciones": "Cada elemento debe ser un objeto."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            participante_id = item.get("participante_id")
            if (
                not isinstance(participante_id, int)
                or isinstance(participante_id, bool)
                or participante_id <= 0
            ):
                return Response(
                    {"predicciones": "Cada participante debe tener un ID válido."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if participante_id in ids_participantes:
                return Response(
                    {"predicciones": "Hay participantes duplicados."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            ids_participantes.append(participante_id)

            goles_pred_local = item.get("goles_local")
            goles_pred_visitante = item.get("goles_visitante")

            if (
                not validar_goles(goles_pred_local)
                or not validar_goles(goles_pred_visitante)
            ):
                return Response(
                    {"predicciones": "Los goles predichos deben ser enteros no negativos o nulos."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if (goles_pred_local is None) != (goles_pred_visitante is None):
                return Response(
                    {"predicciones": "Cada predicción debe tener ambos goles o ninguno."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        participantes_validos = set(
            Participante.objects.filter(
                id__in=ids_participantes
            ).values_list("id", flat=True)
        )

        if participantes_validos != set(ids_participantes):
            return Response(
                {"predicciones": "Uno o varios participantes no existen."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Actualizar el resultado real.
        partido.goles_local = goles_local
        partido.goles_visitante = goles_visitante
        partido.save(update_fields=["goles_local", "goles_visitante"])

        # Crear, actualizar o eliminar las predicciones enviadas.
        for item in predicciones:
            prediccion = Prediccion.objects.filter(
                partido=partido,
                participante_id=item["participante_id"],
            ).first()

            goles_pred_local = item["goles_local"]
            goles_pred_visitante = item["goles_visitante"]

            # Ambos campos vacíos significan que no debe existir predicción.
            if goles_pred_local is None:
                if prediccion is not None:
                    prediccion.delete()
                continue

            if prediccion is None:
                prediccion = Prediccion(
                    partido=partido,
                    participante_id=item["participante_id"],
                )

            prediccion.goles_local = goles_pred_local
            prediccion.goles_visitante = goles_pred_visitante
            prediccion.save()

        return Response(
            {
                "detail": "Partido y predicciones actualizados correctamente."
            },
            status=status.HTTP_200_OK,
        )


class EditarResultadosDiaView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def post(self, request, fecha):
        try:
            fecha_dia = date.fromisoformat(fecha)
        except ValueError:
            return Response(
                {"detail": "La fecha no tiene un formato válido."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        partidos = list(
            PartidoReal.objects.filter(fecha__date=fecha_dia)
        )
        partidos_por_id = {partido.id: partido for partido in partidos}

        if not partidos:
            return Response(
                {"detail": "No hay partidos para esta fecha."},
                status=status.HTTP_404_NOT_FOUND,
            )

        datos = request.data.get("resultados")

        if not isinstance(datos, list):
            return Response(
                {"detail": "Debe enviarse una lista de resultados."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        resultados_por_id = {}

        for resultado in datos:
            if not isinstance(resultado, dict):
                return Response(
                    {"detail": "Cada resultado debe ser un objeto."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            partido_id = resultado.get("partido_id")
            goles_local = resultado.get("goles_local")
            goles_visitante = resultado.get("goles_visitante")

            if partido_id not in partidos_por_id:
                return Response(
                    {"detail": f"El partido {partido_id} no pertenece a esta fecha."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if partido_id in resultados_por_id:
                return Response(
                    {"detail": f"El partido {partido_id} está duplicado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if (goles_local is None) != (goles_visitante is None):
                return Response(
                    {"detail": "Debes introducir ambos goles o dejar ambos vacíos."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            for goles in (goles_local, goles_visitante):
                if goles is not None and (
                    isinstance(goles, bool)
                    or not isinstance(goles, int)
                    or goles < 0
                ):
                    return Response(
                        {"detail": "Los goles deben ser enteros no negativos."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            resultados_por_id[partido_id] = (
                goles_local,
                goles_visitante,
            )

        if set(resultados_por_id) != set(partidos_por_id):
            return Response(
                {"detail": "Debes incluir todos los partidos de esta fecha."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            for partido in partidos:
                goles_local, goles_visitante = resultados_por_id[partido.id]

                partido.goles_local = goles_local
                partido.goles_visitante = goles_visitante
                partido.save(
                    update_fields=["goles_local", "goles_visitante"]
                )

        return Response(
            {"detail": "Resultados del día guardados correctamente."},
            status=status.HTTP_200_OK,
        )
