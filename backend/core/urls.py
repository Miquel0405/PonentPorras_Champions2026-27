from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    EquipoListCreateView,
    EquipoDetailView,
    PaisListCreateView,
    PaisDetailView,
    ParticipanteListCreateView,
    ParticipanteDetailView,
    PartidoRealListCreateView,
    PartidoRealDetailView,
    PartidosInicioView,
    PrediccionListCreateView,
    PrediccionDetailView,
    ClasificacionView,
    EditarPartidoCompletoView,
    EditarPrediccionesDiaView,
    EditarResultadosDiaView,
)


urlpatterns = [
    path("equipos/", EquipoListCreateView.as_view(), name="equipo-list-create"),
    path("equipos/<int:pk>/", EquipoDetailView.as_view(), name="equipo-detail"),

    path("paises/", PaisListCreateView.as_view(), name="pais-list-create"),
    path("paises/<int:pk>/", PaisDetailView.as_view(), name="pais-detail"),

    path("participantes/", ParticipanteListCreateView.as_view(), name="participante-list-create"),
    path("participantes/<int:pk>/", ParticipanteDetailView.as_view(), name="participante-detail"),

    path("partidos/", PartidoRealListCreateView.as_view(), name="partido-real-list-create"),
    path("partidos/<int:pk>/", PartidoRealDetailView.as_view(), name="partido-real-detail"),

    path("predicciones/", PrediccionListCreateView.as_view(), name="prediccion-list-create"),
    path("predicciones/<int:pk>/", PrediccionDetailView.as_view(), name="prediccion-detail"),

    path("clasificacion/", ClasificacionView.as_view(), name="clasificacion"),
    path("partidos-inicio/", PartidosInicioView.as_view(), name="partidos-inicio"),
    path("partidos/<int:pk>/editar-completo/", EditarPartidoCompletoView.as_view(), name="partido-editar-completo"),
    path("participantes/<int:participante_id>/predicciones-dia/<str:fecha>/", EditarPrediccionesDiaView.as_view(), name="editar-predicciones-dia"),
    path("partidos/dia/<str:fecha>/resultados/", EditarResultadosDiaView.as_view(), name="editar-resultados-dia"),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )