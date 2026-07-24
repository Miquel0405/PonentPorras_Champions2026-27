from rest_framework import generics

from ..permissions import IsAdminOrReadOnly
from ..serializers import ParticipanteSerializer, ParticipanteDetailSerializer
from datetime import date

from django.db import transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Participante, PartidoReal, Prediccion


class ParticipanteListCreateView(generics.ListCreateAPIView):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
    permission_classes = [IsAdminOrReadOnly]


class ParticipanteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ParticipanteDetailSerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        return Participante.objects.prefetch_related(
            "predicciones__partido__equipo_local",
            "predicciones__partido__equipo_visitante",
        )

class EditarPrediccionesDiaView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    @transaction.atomic
    def post(self, request, participante_id, fecha):
        try:
            fecha_dia = date.fromisoformat(fecha)
        except ValueError:
            return Response(
                {"detail": "La fecha no es válida. Usa el formato AAAA-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            participante = Participante.objects.get(pk=participante_id)
        except Participante.DoesNotExist:
            return Response(
                {"detail": "El participante no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        partidos = list(
            PartidoReal.objects.filter(fecha__date=fecha_dia)
        )
        partidos_por_id = {partido.id: partido for partido in partidos}
        ids_partidos = set(partidos_por_id)

        datos = request.data.get("predicciones")

        if not isinstance(datos, list):
            return Response(
                {"predicciones": "Debe enviarse una lista de predicciones."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        ids_recibidos = set()

        def goles_validos(valor):
            return (
                valor is None
                or (
                    isinstance(valor, int)
                    and not isinstance(valor, bool)
                    and valor >= 0
                )
            )

        # Validar toda la petición antes de modificar datos.
        for item in datos:
            if not isinstance(item, dict):
                return Response(
                    {"predicciones": "Cada elemento debe ser un objeto."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            partido_id = item.get("partido_id")

            if (
                not isinstance(partido_id, int)
                or isinstance(partido_id, bool)
                or partido_id not in ids_partidos
            ):
                return Response(
                    {"predicciones": "Hay un partido inválido para esa fecha."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if partido_id in ids_recibidos:
                return Response(
                    {"predicciones": "Hay partidos duplicados."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            ids_recibidos.add(partido_id)

            goles_local = item.get("goles_local")
            goles_visitante = item.get("goles_visitante")

            if not goles_validos(goles_local) or not goles_validos(goles_visitante):
                return Response(
                    {"predicciones": "Los goles deben ser enteros no negativos o nulos."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if (goles_local is None) != (goles_visitante is None):
                return Response(
                    {"predicciones": "Cada predicción debe tener ambos goles o ninguno."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        if ids_recibidos != ids_partidos:
            return Response(
                {
                    "predicciones": (
                        "Debe enviarse una entrada para cada partido de la fecha."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        for item in datos:
            prediccion = Prediccion.objects.filter(
                participante=participante,
                partido_id=item["partido_id"],
            ).first()

            goles_local = item["goles_local"]
            goles_visitante = item["goles_visitante"]

            if goles_local is None:
                if prediccion is not None:
                    prediccion.delete()
                continue

            if prediccion is None:
                prediccion = Prediccion(
                    participante=participante,
                    partido=partidos_por_id[item["partido_id"]],
                )

            prediccion.goles_local = goles_local
            prediccion.goles_visitante = goles_visitante
            prediccion.save()

        return Response(
            {"detail": "Predicciones del día guardadas correctamente."},
            status=status.HTTP_200_OK,
        )
