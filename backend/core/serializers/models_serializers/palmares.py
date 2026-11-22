from rest_framework import serializers

from ...models import Palmares


class PalmaresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Palmares
        fields = ["id", "competicion", "posicion", "descripcion"]
        read_only_fields = ["id"]
