from rest_framework import serializers

from ..models import Participante
from .prediccion_detalle import PrediccionParticipanteSerializer

class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = [
            "id",
            "nombre",
        ]
        read_only_fields = ["id"]

class ParticipanteDetailSerializer(serializers.ModelSerializer):
    predicciones = PrediccionParticipanteSerializer(many=True, read_only=True)
    puntos = serializers.SerializerMethodField()

    class Meta(ParticipanteSerializer.Meta):
        model = Participante
        fields = ParticipanteSerializer.Meta.fields + ["predicciones", "puntos"]

    def get_puntos(self, obj):
        return sum(prediccion.puntos for prediccion in obj.predicciones.all())