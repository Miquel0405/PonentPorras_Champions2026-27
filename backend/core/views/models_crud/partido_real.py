from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import generics
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework import serializers

from ...services.partidos import queryset_partidos
from ...services.actualizar_resultado import (
    actualizar_resultados_dia,
    editar_partido_completo,
)

from ...models import PartidoReal
from ...serializers import (
    EditarPartidoCompletoSerializer,
    EditarResultadosDiaSerializer,
    PartidoRealSerializer,
    PartidoRealWithPronosticosSerializer,
)
from ...filters import PartidosFilter
from ...permissions import IsAdminOrReadOnly

# GET // POST (Obtindre tots els partits, )
class PartidoRealListCreateView(generics.ListCreateAPIView):
    serializer_class = PartidoRealSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = PartidosFilter
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        return queryset_partidos().order_by("fecha", "id")

# /i/ GET, PUT, PATCH, DELETE)
class PartidoRealDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PartidoReal.objects.select_related(
        "equipo_local",
        "equipo_visitante",
    ).prefetch_related(
        "pronosticos__participante",
    )
    serializer_class = PartidoRealWithPronosticosSerializer
    permission_classes = [IsAdminOrReadOnly]


class EditarPartidoCompletoView(generics.GenericAPIView):
    serializer_class = EditarPartidoCompletoSerializer
    permission_classes = [IsAdminOrReadOnly]

    def post(self, request, pk):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            partido = editar_partido_completo(
                partido_id=pk,
                **serializer.validated_data,
            )
        except PartidoReal.DoesNotExist as error:
            raise NotFound("No existe el partido solicitado.") from error

        return Response(PartidoRealWithPronosticosSerializer(partido).data)


class EditarResultadosDiaView(generics.GenericAPIView):
    serializer_class = EditarResultadosDiaSerializer
    permission_classes = [IsAdminOrReadOnly]

    def post(self, request, fecha):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            fecha_validada = serializers.DateField().run_validation(fecha)
        except serializers.ValidationError as error:
            raise ValidationError({"fecha": error.detail}) from error

        try:
            partidos = actualizar_resultados_dia(
                fecha=fecha_validada,
                resultados=serializer.validated_data["resultados"],
            )
        except ValueError as error:
            raise ValidationError({"resultados": str(error)}) from error

        return Response(PartidoRealWithPronosticosSerializer(partidos, many=True).data)