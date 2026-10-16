from django.db.models import Count, Q, Sum

from ..models import Participante, Pronostico


def obtener_clasificacion():
    participantes = (
        Participante.objects
        .annotate(
            total_puntos=Sum("pronosticos__puntos", default=0),
            nb_pronosticos=Count("pronosticos"),
            nb_plenos=Count(
                "pronosticos",
                filter=Q(
                    pronosticos__estado=Pronostico.EstadoPorra.ACIERTO_EXACTO
                ),
            ),
            nb_ddg=Count(
                "pronosticos",
                filter=Q(
                    pronosticos__estado=Pronostico.EstadoPorra.DIFERENCIA_GOLES
                ),
            ),
            nb_1x2=Count(
                "pronosticos",
                filter=Q(
                    pronosticos__estado=Pronostico.EstadoPorra.ACIERTO_1X2
                ),
            ),
            nb_errores=Count(
                "pronosticos",
                filter=Q(pronosticos__estado=Pronostico.EstadoPorra.ERROR),
            ),
        )
        .order_by(
            "-total_puntos",
            "-nb_plenos",
            "-nb_ddg",
            "-nb_1x2",
            "nombre",
        )
    )

    return [
        {
            "participante": participante.id,
            "nombre": participante.nombre,
            "puntos": participante.total_puntos or 0,
            "nb_pronosticos": participante.nb_pronosticos,
            "nb_plenos": participante.nb_plenos,
            "nb_ddg": participante.nb_ddg,
            "nb_1x2": participante.nb_1x2,
            "nb_errores": participante.nb_errores,
        }
        for participante in participantes
    ]