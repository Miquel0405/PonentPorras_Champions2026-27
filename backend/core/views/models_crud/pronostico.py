from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import generics

from ...permissions import IsAdminOrReadOnly
from ...models import Pronostico
from ...serializers import PronosticoSerializer
from ...filters import PronosticosFilter

# GET // POST
class PronosticoListCreateView(generics.ListCreateAPIView):
    queryset = Pronostico.objects.select_related(
        "participante",
        "partido",
        "partido__equipo_local",
        "partido__equipo_visitante",
    )
    serializer_class = PronosticoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PronosticosFilter
    permission_classes = [IsAdminOrReadOnly]

# /i/ GET, PUT, PATCH, DELETE
class PronosticoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pronostico.objects.select_related(
        "participante",
        "partido",
        "partido__equipo_local",
        "partido__equipo_visitante",
    )
    serializer_class = PronosticoSerializer
    permission_classes = [IsAdminOrReadOnly]