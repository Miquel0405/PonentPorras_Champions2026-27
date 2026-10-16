
from django.db import transaction

from ..models import PartidoReal, Participante, Pronostico


@transaction.atomic
def actualizar_pronostico_and_puntos(partido_id, participante_id, goles_local, goles_visitante):
    
    pronostico = Pronostico.objects.filter(
        partido_id=partido_id,
        participante_id=participante_id,
    ).first()

    # Ambos goles nulos: eliminar pronostico
    if goles_local is None and goles_visitante is None:
        if pronostico is not None:
            pronostico.delete()
        return None

    # Crear si no existe
    if pronostico is None:
        pronostico = Pronostico(
            partido_id=partido_id,
            participante_id=participante_id,
        )

    pronostico.goles_local = goles_local
    pronostico.goles_visitante = goles_visitante

    pronostico.puntos = pronostico.calcular_resultado_pronostico()

    return pronostico


@transaction.atomic
def actualizar_pronosticos_participante_dia(
    participante,
    fecha,
    pronosticos_datos,
):
    participante = Participante.objects.select_for_update().get(
        pk=participante.pk
    )
    partidos_del_dia = list(
        PartidoReal.objects.select_for_update()
        .filter(fecha__date=fecha)
        .order_by("id")
    )
    partidos_por_id = {partido.pk: partido for partido in partidos_del_dia}
    datos_por_partido = {
        datos["partido"].pk: datos for datos in pronosticos_datos
    }

    if set(datos_por_partido) != set(partidos_por_id):
        raise ValueError(
            "La lista de porras debe incluir todos los partidos de la fecha."
        )

    existentes = {
        pronostico.partido_id: pronostico
        for pronostico in Pronostico.objects.select_for_update().filter(
            participante=participante,
            partido_id__in=partidos_por_id,
        )
    }

    para_crear = []
    para_actualizar = []
    para_borrar = []
    for partido_id, partido in partidos_por_id.items():
        datos = datos_por_partido[partido_id]
        goles_local = datos["goles_local"]
        goles_visitante = datos["goles_visitante"]
        pronostico = existentes.get(partido_id)

        if goles_local is None:
            if pronostico is not None:
                para_borrar.append(pronostico.pk)
            continue

        if pronostico is None:
            pronostico = Pronostico(
                partido=partido,
                participante=participante,
            )
        pronostico.goles_local = goles_local
        pronostico.goles_visitante = goles_visitante
        pronostico.calcular_resultado_pronostico()

        if pronostico.pk is None:
            para_crear.append(pronostico)
        else:
            para_actualizar.append(pronostico)

    if para_borrar:
        Pronostico.objects.filter(pk__in=para_borrar).delete()
    if para_crear:
        Pronostico.objects.bulk_create(para_crear)
    if para_actualizar:
        Pronostico.objects.bulk_update(
            para_actualizar,
            ["goles_local", "goles_visitante", "estado", "puntos"],
        )

    pronosticos_ids = [
        pronostico.pk
        for pronostico in [*para_actualizar, *para_crear]
    ]
    return list(
        Pronostico.objects.filter(pk__in=pronosticos_ids)
        .select_related(
            "participante",
            "partido__equipo_local",
            "partido__equipo_visitante",
        )
        .order_by("partido_id")
    )
