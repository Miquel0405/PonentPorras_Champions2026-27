from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    EquipoListCreateView,
    EquipoDetailView,
    ParticipanteListCreateView,
    ParticipanteDetailView,
    PartidoRealListCreateView,
    PartidoRealDetailView,
    PartidosInicioView,
    PronosticoListCreateView,
    PronosticoDetailView,
    ClasificacionView,
    EditarPartidoCompletoView,
    EditarPronosticosDiaView,
    EditarResultadosDiaView,
)


urlpatterns = [
    path("equipos/", EquipoListCreateView.as_view(), name="equipo-list-create"),
    path("equipos/<int:pk>/", EquipoDetailView.as_view(), name="equipo-detail"),

    path("participantes/", ParticipanteListCreateView.as_view(), name="participante-list-create"),
    path("participantes/<int:participante_id>/pronosticos-dia/<str:fecha>/", EditarPronosticosDiaView.as_view(), name="editar-pronosticos-dia"),
    path("participantes/<int:pk>/", ParticipanteDetailView.as_view(), name="participante-detail"),

    path("partidos/", PartidoRealListCreateView.as_view(), name="partido-real-list-create"),
    path("partidos/dia/<str:fecha>/resultados/", EditarResultadosDiaView.as_view(), name="editar-resultados-dia"),
    path("partidos/<int:pk>/editar-completo/", EditarPartidoCompletoView.as_view(), name="partido-editar-completo"),
    path("partidos/<int:pk>/", PartidoRealDetailView.as_view(), name="partido-real-detail"),

    path("pronosticos/", PronosticoListCreateView.as_view(), name="prediccion-list-create"),
    path("pronosticos/<int:pk>/", PronosticoDetailView.as_view(), name="prediccion-detail"),

    path("clasificacion/", ClasificacionView.as_view(), name="clasificacion"),
    path("partidos-inicio/", PartidosInicioView.as_view(), name="partidos-inicio"),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )