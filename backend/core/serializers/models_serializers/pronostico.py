from rest_framework import serializers

from ...models import Pronostico, Participante, PartidoReal
from .partido_real import PartidoRealSerializer
from .participante import ParticipanteSerializer

### Base serializer for Pronostico
class PronosticoSerializer(serializers.ModelSerializer):
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
        model = Pronostico
        fields = [
            "id",
            "participante",
            "participante_id",
            "partido",
            "partido_id",
            "goles_local",
            "goles_visitante",
            "puntos",
            "estado",
        ]

        read_only_fields = ["id", "puntos", "estado"]

    def __init__(self, *args, **kwargs):
            exclude_fields = kwargs.pop("exclude_fields", [])
    
            super().__init__(*args, **kwargs)
    
            for field in exclude_fields:
                self.fields.pop(field, None)