
from rest_framework import serializers

from ...models import PartidoReal, Equipo
from .equipo import EquipoSerializer

## Base serializer for PartidoReal
class PartidoRealSerializer(serializers.ModelSerializer):
    equipo_local = EquipoSerializer(read_only=True)
    equipo_visitante = EquipoSerializer(read_only=True)

    equipo_local_id = serializers.PrimaryKeyRelatedField(
        source="equipo_local",
        queryset=Equipo.objects.all(),
        write_only=True,
    )

    equipo_visitante_id = serializers.PrimaryKeyRelatedField(
        source="equipo_visitante",
        queryset=Equipo.objects.all(),
        write_only=True,
    )

    class Meta:
        model = PartidoReal
        fields = [
            "id",
            "equipo_local",
            "equipo_local_id",
            "equipo_visitante",
            "equipo_visitante_id",
            "fecha",
            "fase",
            "goles_local",
            "goles_visitante",
        ]
        read_only_fields = ["id"]