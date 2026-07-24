from rest_framework import generics

from ..models import Pais
from ..permissions import IsAdminOrReadOnly
from ..serializers import PaisSerializer

class PaisListCreateView(generics.ListCreateAPIView):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer
    permission_classes = [IsAdminOrReadOnly]

class PaisDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer
    permission_classes = [IsAdminOrReadOnly]