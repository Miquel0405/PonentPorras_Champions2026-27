from rest_framework import serializers

from ...models import Participante

## Base serializer for Participante
class ParticipanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participante
        fields = [
            "id",
            "nombre",
        ]
        read_only_fields = ["id"]