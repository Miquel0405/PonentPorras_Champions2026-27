from rest_framework import serializers

from ..models import PartidoReal


class PronosticoDiaItemSerializer(serializers.Serializer):
    partido_id = serializers.PrimaryKeyRelatedField(
        source="partido",
        queryset=PartidoReal.objects.all(),
    )
    goles_local = serializers.IntegerField(min_value=0, allow_null=True)
    goles_visitante = serializers.IntegerField(min_value=0, allow_null=True)

    def validate(self, attrs):
        if (attrs["goles_local"] is None) != (attrs["goles_visitante"] is None):
            raise serializers.ValidationError(
                "Los dos goles de la porra deben estar informados o vacíos."
            )
        return attrs


class EditarPronosticosDiaSerializer(serializers.Serializer):
    pronosticos = PronosticoDiaItemSerializer(many=True)

    def validate(self, attrs):
        partidos_ids = [item["partido"].pk for item in attrs["pronosticos"]]
        if len(partidos_ids) != len(set(partidos_ids)):
            raise serializers.ValidationError({
                "pronosticos": "No se puede incluir más de una porra por partido.",
            })
        return attrs
