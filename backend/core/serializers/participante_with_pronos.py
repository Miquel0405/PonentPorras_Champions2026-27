from rest_framework import serializers

from ..models import Participante
from .models_serializers import PronosticoSerializer, ParticipanteSerializer

class ParticipanteWithPronosticosSerializer(ParticipanteSerializer):
    pronosticos = PronosticoSerializer(many=True, read_only=True, exclude_fields=["participante", "participante_id"])
    puntos = serializers.SerializerMethodField()
    plenos = serializers.SerializerMethodField()
    ddg = serializers.SerializerMethodField()
    x1x2 = serializers.SerializerMethodField()
    errores = serializers.SerializerMethodField()

    class Meta(ParticipanteSerializer.Meta):
        model = Participante
        fields = ParticipanteSerializer.Meta.fields + ["pronosticos", "puntos", "plenos", "ddg", "x1x2", "errores"]

    def get_puntos(self, obj):
        return sum(prediccion.puntos for prediccion in obj.pronosticos.all())

    def get_plenos(self, obj):
        return sum(1 for prediccion in obj.pronosticos.all() if prediccion.estado == 3)

    def get_ddg(self, obj):
        return sum(1 for prediccion in obj.pronosticos.all() if prediccion.estado == 2)

    def get_x1x2(self, obj):
        return sum(1 for prediccion in obj.pronosticos.all() if prediccion.estado == 1)

    def get_errores(self, obj):
        return sum(1 for prediccion in obj.pronosticos.all() if prediccion.estado == 0)