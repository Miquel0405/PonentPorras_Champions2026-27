from rest_framework import generics
from rest_framework.response import Response

from ..permissions import IsAdminOrReadOnly
from ..serializers import ClasificacionSerializer
from ..services.clasificacion import obtener_clasificacion


class ClasificacionView(generics.GenericAPIView):
    serializer_class = ClasificacionSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, *args, **kwargs):
        clasificacion = obtener_clasificacion()

        serializer = self.get_serializer(clasificacion, many=True)

        return Response(serializer.data)