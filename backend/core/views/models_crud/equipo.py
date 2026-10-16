from rest_framework import generics

from ...models import Equipo
from ...serializers import EquipoSerializer
from ...permissions import IsAdminOrReadOnly

# GET /api/equipos/ Torna tots els equips -> Qualsevol amb acces de lectura
# POST /api/equipos/ Crea un nou equip -> Administrador
class EquipoListCreateView(generics.ListCreateAPIView):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [IsAdminOrReadOnly]

# GET /api/equipos/1/ Consulta equip 1
# PUT /api/equipos/1/ Canvia les dades editables del equip 1
# PATCH /api/equipos/1/ Modifica parcialment equip 1
# DELETE /api/equipos/1/ Elimina el equip 1
class EquipoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Equipo.objects.all()
    serializer_class = EquipoSerializer
    permission_classes = [IsAdminOrReadOnly]