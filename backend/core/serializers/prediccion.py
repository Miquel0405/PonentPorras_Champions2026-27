from rest_framework import serializers

from ..models import Prediccion, Participante, PartidoReal
from .partido_real import PartidoRealSerializer
from .participante import ParticipanteSerializer

class PrediccionSerializer(serializers.ModelSerializer):
    participante = ParticipanteSerializer(read_only=True)
    partido = PartidoRealSerializer(read_only=True)

    participante_id = serializers.PrimaryKeyRelatedField(
        source="participante",
        queryset=Participante.objects.all(),
        write_only=True,
    )
    partido_id = serializers.PrimaryKeyRelatedField(
        source="partido",
        queryset=PartidoReal.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Prediccion
        fields = [
            "id",
            "participante",
            "participante_id",
            "partido",
            "partido_id",
            "goles_local",
            "goles_visitante",
            "puntos",
        ]

        read_only_fields = ["id", "puntos"]