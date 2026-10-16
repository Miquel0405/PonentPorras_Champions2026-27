from rest_framework import serializers

from ..models import Participante


class PronosticoEdicionSerializer(serializers.Serializer):
    participante_id = serializers.PrimaryKeyRelatedField(
        source="participante",
        queryset=Participante.objects.all(),
    )
    goles_local = serializers.IntegerField(min_value=0, allow_null=True)
    goles_visitante = serializers.IntegerField(min_value=0, allow_null=True)

    def validate(self, attrs):
        if (attrs["goles_local"] is None) != (attrs["goles_visitante"] is None):
            raise serializers.ValidationError(
                "Los dos goles de la porra deben estar informados o vacíos."
            )
        return attrs


class EditarPartidoCompletoSerializer(serializers.Serializer):
    goles_local = serializers.IntegerField(min_value=0, allow_null=True)
    goles_visitante = serializers.IntegerField(min_value=0, allow_null=True)
    pronosticos = PronosticoEdicionSerializer(many=True)

    def validate(self, attrs):
        if (attrs["goles_local"] is None) != (attrs["goles_visitante"] is None):
            raise serializers.ValidationError({
                "goles_local": "El marcador debe tener ambos goles o estar vacío.",
            })

        participantes_ids = [
            pronostico["participante"].pk
            for pronostico in attrs["pronosticos"]
        ]
        if len(participantes_ids) != len(set(participantes_ids)):
            raise serializers.ValidationError({
                "pronosticos": "No se puede incluir más de una porra por participante.",
            })

        return attrs
