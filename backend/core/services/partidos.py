
from datetime import datetime, time, timedelta

from django.utils import timezone

from ..models import PartidoReal


def queryset_partidos():
    return PartidoReal.objects.select_related(
        "equipo_local",
        "equipo_visitante",
    )

def inicio_dia(fecha):
    return timezone.make_aware(
        datetime.combine(fecha, time.min),
        timezone.get_current_timezone(),
    )


def obtener_partidos_por_fecha(fecha):
    inicio = inicio_dia(fecha)
    fin = inicio_dia(fecha + timedelta(days=1))

    return (
        queryset_partidos().filter(fecha__gte=inicio, fecha__lt=fin).order_by("fecha", "id")
    )


def obtener_partidos_inicio():
    hoy = timezone.localdate()
    manana = hoy + timedelta(days=1)

    partidos_hoy = list(obtener_partidos_por_fecha(hoy))

    if partidos_hoy:
        return {
            "tipo": "hoy",
            "fecha": hoy,
            "partidos": partidos_hoy,
        }

    siguiente_partido = (
        PartidoReal.objects
        .filter(fecha__gte=inicio_dia(manana))
        .order_by("fecha")
        .first()
    )

    if siguiente_partido is None:
        return {
            "tipo": "ninguno",
            "fecha": None,
            "partidos": PartidoReal.objects.none(),
        }

    siguiente_fecha = timezone.localtime(
        siguiente_partido.fecha
    ).date()

    return {
        "tipo": "proximo",
        "fecha": siguiente_fecha,
        "partidos": obtener_partidos_por_fecha(siguiente_fecha),
    }