from ..models import PartidoReal
from .models_serializers import PronosticoSerializer, PartidoRealSerializer


class PartidoRealWithPronosticosSerializer(PartidoRealSerializer):
    pronosticos = PronosticoSerializer(many=True, read_only=True, exclude_fields=["partido", "partido_id"])

    class Meta(PartidoRealSerializer.Meta):
        model = PartidoReal
        fields = PartidoRealSerializer.Meta.fields + ["pronosticos"]