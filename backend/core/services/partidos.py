from ..models import PartidoReal
from django.utils import timezone

def obtener_partidos_por_fecha(fecha):
    return (
        PartidoReal.objects
        .filter(fecha__date=fecha)
    )

def obtener_partidos_inicio():
    hoy = timezone.localdate()
    partidos_hoy = obtener_partidos_por_fecha(hoy)

    if partidos_hoy.exists():
        return {
            "tipo": "hoy",
            "fecha": hoy,
            "partidos": partidos_hoy,
        }

    siguiente_partido = (
        PartidoReal.objects
        .filter(fecha__date__gt=hoy)
        .first()
    )

    if siguiente_partido is None:
        return {
            "tipo": "ninguno",
            "fecha": None,
            "partidos": PartidoReal.objects.none(),
        }

    siguiente_fecha = siguiente_partido.fecha.date()

    partidos_siguiente_dia = PartidoReal.objects.filter(
        fecha__date=siguiente_fecha
    )

    return {
        "tipo": "proximo",
        "fecha": siguiente_fecha,
        "partidos": partidos_siguiente_dia,
    }