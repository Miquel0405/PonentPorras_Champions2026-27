from rest_framework import serializers

from ..models import PartidoReal


class ResultadoDiaItemSerializer(serializers.Serializer):
    partido_id = serializers.PrimaryKeyRelatedField(
        source="partido",
        queryset=PartidoReal.objects.all(),
    )
    goles_local = serializers.IntegerField(min_value=0, allow_null=True)
    goles_visitante = serializers.IntegerField(min_value=0, allow_null=True)

    def validate(self, attrs):
        if (attrs["goles_local"] is None) != (attrs["goles_visitante"] is None):
            raise serializers.ValidationError(
                "El resultado debe tener ambos goles o estar vacío."
            )
        return attrs


class EditarResultadosDiaSerializer(serializers.Serializer):
    resultados = ResultadoDiaItemSerializer(many=True)

    def validate(self, attrs):
        partidos_ids = [item["partido"].pk for item in attrs["resultados"]]
        if len(partidos_ids) != len(set(partidos_ids)):
            raise serializers.ValidationError({
                "resultados": "No se puede incluir más de un resultado por partido.",
            })
        return attrs
