from rest_framework import serializers

from ..models import Pais

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = ["id", 
                  "nombre",
                  "abreviatura",
                  "bandera",
        ]
        read_only_fields = ["id"]