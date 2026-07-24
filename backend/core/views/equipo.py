from rest_framework import generics

from ..models import Equipo
from ..permissions import IsAdminOrReadOnly
from ..serializers import EquipoSerializer


class EquipoListCreateView(generics.ListCreateAPIView):
    queryset = Equipo.objects.select_related("pais").all()
    serializer_class = EquipoSerializer
    permission_classes = [IsAdminOrReadOnly]


class EquipoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipo.objects.select_related("pais").all()
    serializer_class = EquipoSerializer
    permission_classes = [IsAdminOrReadOnly]