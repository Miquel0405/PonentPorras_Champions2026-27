
from django.db.models import Q
from django_filters import rest_framework as filters

from .models import PartidoReal, Pronostico

class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    """Acepta varios identificadores separados por comas."""
    pass

class EquiposFilter(filters.FilterSet):
    pass

class ParticipantesFilter(filters.FilterSet):
    pass

class PartidosFilter(filters.FilterSet):
    
    # Filtro por fecha
    fecha = filters.DateFilter(
        field_name="fecha",
        lookup_expr="date",
    )

    # Filtro por rango de fechas
    fecha_desde = filters.DateFilter(
        field_name="fecha",
        lookup_expr="gte",
    )

    fecha_hasta = filters.DateFilter(
        field_name="fecha",
        lookup_expr="lte",
    )

    # Filtro por equipos participantes en los partidos
    equipos = NumberInFilter(
        method="filter_equipos",
    )
    
    def filter_equipos(self, queryset, name, value):
        return queryset.filter(
            Q(equipo_local_id__in=value) | Q(equipo_visitante_id__in=value)
        ).distinct()

    class Meta:
        model = PartidoReal
        fields = [
            "fecha",
            "fecha_desde",
            "fecha_hasta",
            "equipos",
        ]

class PronosticosFilter(filters.FilterSet):
    participante = NumberInFilter(
        field_name="participante_id",
        lookup_expr="in",
    )

    # Filtro por un partido o varios
    partido = NumberInFilter(
        field_name="partido_id",
        lookup_expr="in",
    )

    # Filtro por una fecha concreta o rango de fechas del partido
    fecha = filters.DateFilter(
        field_name="partido__fecha",
        lookup_expr="date",
    )

    fecha_desde = filters.DateFilter(
        field_name="partido__fecha",
        lookup_expr="gte",
    )

    fecha_hasta = filters.DateFilter(
        field_name="partido__fecha",
        lookup_expr="lte",
    )

    # Filtro por partidos donde participa al menos uno de los equipos indicados
    equipos = NumberInFilter(
        method="filter_equipos",
    )

    def filter_equipos(self, queryset, name, value):
        return queryset.filter(
            Q(partido__equipo_local_id__in=value) | Q(partido__equipo_visitante_id__in=value)
        ).distinct()

    class Meta:
        model = Pronostico
        fields = [
            "participante",
            "partido",
            "fecha",
            "fecha_desde",
            "fecha_hasta",
            "equipos",
        ]
