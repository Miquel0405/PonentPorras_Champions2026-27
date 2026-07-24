from django.db.models import Count, Sum

from ..models import Participante


def obtener_clasificacion():
    participantes = (
        Participante.objects
        .annotate(
            total_puntos=Sum("predicciones__puntos", default=0),
            num_predicciones=Count("predicciones")
        )
        .order_by("-total_puntos", "nombre")
    )

    return [
        {
            "participante": participante.id,
            "nombre": participante.nombre,
            "puntos": participante.total_puntos or 0,
            "predicciones": participante.num_predicciones,
        }
        for participante in participantes
    ]