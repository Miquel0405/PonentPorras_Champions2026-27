from rest_framework import generics
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import serializers

from ...serializers import (
    EditarPronosticosDiaSerializer,
    ParticipanteSerializer,
    ParticipanteWithPronosticosSerializer,
    PronosticoSerializer,
)
from ...models import Participante
from ...permissions import IsAdminOrReadOnly
from ...services.actualizar_pronostico import actualizar_pronosticos_participante_dia

# GET and POST
class ParticipanteListCreateView(generics.ListCreateAPIView):
    queryset = Participante.objects.all()
    serializer_class = ParticipanteSerializer
    permission_classes = [IsAdminOrReadOnly]

# /i/ GET, PUT, PATCH, DELETE
class ParticipanteDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ParticipanteWithPronosticosSerializer
    permission_classes = [IsAdminOrReadOnly]

    # Permet accedir a les pronosticos de un partit concret (amb un equip local i un equop visitant concret)
    def get_queryset(self):
        return Participante.objects.prefetch_related(
            "pronosticos__partido__equipo_local",
            "pronosticos__partido__equipo_visitante",
        )


class EditarPronosticosDiaView(generics.GenericAPIView):
    serializer_class = EditarPronosticosDiaSerializer
    permission_classes = [IsAdminOrReadOnly]

    def post(self, request, participante_id, fecha):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            fecha_validada = serializers.DateField().run_validation(fecha)
        except serializers.ValidationError as error:
            raise ValidationError({"fecha": error.detail}) from error

        participante = get_object_or_404(
            Participante,
            pk=participante_id,
        )
        try:
            pronosticos = actualizar_pronosticos_participante_dia(
                participante=participante,
                fecha=fecha_validada,
                pronosticos_datos=serializer.validated_data["pronosticos"],
            )
        except ValueError as error:
            raise ValidationError({"pronosticos": str(error)}) from error
        except Participante.DoesNotExist as error:
            raise NotFound("No existe el participante solicitado.") from error

        return Response(PronosticoSerializer(pronosticos, many=True).data)