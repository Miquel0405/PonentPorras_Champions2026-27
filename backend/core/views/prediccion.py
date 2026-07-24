from rest_framework import generics

from ..models import Prediccion
from ..permissions import IsAdminOrReadOnly
from ..serializers import PrediccionSerializer


class PrediccionListCreateView(generics.ListCreateAPIView):
    queryset = Prediccion.objects.select_related(
        "participante",
        "partido",
        "partido__equipo_local",
        "partido__equipo_visitante"
    )
    serializer_class = PrediccionSerializer
    permission_classes = [IsAdminOrReadOnly]


class PrediccionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Prediccion.objects.select_related(
        "participante",
        "partido",
        "partido__equipo_local",
        "partido__equipo_visitante"
    )
    serializer_class = PrediccionSerializer
    permission_classes = [IsAdminOrReadOnly]