from rest_framework import serializers
from ...models import Equipo

## Base serializer for Equipo
class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = ["id", 
                  "nombre",
                  "escudo",
                  "apodo_puskas",
        ]
        read_only_fields = ["id"]
