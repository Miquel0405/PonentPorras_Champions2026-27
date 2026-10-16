from rest_framework import generics
from rest_framework.response import Response

from ..services.partidos import obtener_partidos_inicio

from ..serializers import PartidoRealSerializer
from ..permissions import IsAdminOrReadOnly

# GET Partidos-Inicio
class PartidosInicioView(generics.GenericAPIView):
    serializer_class = PartidoRealSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, *args, **kwargs):
        datos = obtener_partidos_inicio()

        return Response({
            "tipo": datos["tipo"],
            "fecha": (
                datos["fecha"].isoformat()
                if datos["fecha"] is not None
                else None
            ),
            "partidos": self.get_serializer(
                datos["partidos"],
                many=True,
            ).data,
        })