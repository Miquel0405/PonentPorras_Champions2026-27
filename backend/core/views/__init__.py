from .equipo import (
    EquipoListCreateView,
    EquipoDetailView,
)

from .pais import (
    PaisListCreateView,
    PaisDetailView,
)

from .partido_real import (
    PartidoRealListCreateView,
    PartidoRealDetailView,
    PartidosInicioView,
    EditarPartidoCompletoView,
    EditarResultadosDiaView,
)

from .participante import (
    ParticipanteListCreateView,
    ParticipanteDetailView,
    EditarPrediccionesDiaView,
)

from .prediccion import (
    PrediccionListCreateView,
    PrediccionDetailView,
)
from .clasificacion import (
    ClasificacionView,
)
from .health import health