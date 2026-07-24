from rest_framework import serializers

from ..models import Equipo, Pais
from .pais import PaisSerializer


class EquipoSerializer(serializers.ModelSerializer):
    pais = PaisSerializer(read_only=True)

    pais_id = serializers.PrimaryKeyRelatedField(
        source="pais",
        queryset=Pais.objects.all(),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Equipo
        fields = ["id", 
                  "nombre",
                  "abreviatura",
                  "pais",
                  "pais_id",
                  "escudo",
                  "apodo_puskas",
        ]
        read_only_fields = ["id"]