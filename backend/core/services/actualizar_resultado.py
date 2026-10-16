
from django.db import transaction

from ..models import PartidoReal, Pronostico


@transaction.atomic
def actualizar_resultado_and_puntos(partido_id, goles_local, goles_visitante):
    partido = PartidoReal.objects.select_for_update().get(
        pk=partido_id
    )

    partido.goles_local = goles_local
    partido.goles_visitante = goles_visitante

    partido.save(
        update_fields=[
            "goles_local",
            "goles_visitante",
        ]
    )

    return partido


@transaction.atomic
def editar_partido_completo(
    partido_id,
    goles_local,
    goles_visitante,
    pronosticos,
):
    partido = PartidoReal.objects.select_for_update().get(pk=partido_id)
    pronosticos_existentes = {
        pronostico.participante_id: pronostico
        for pronostico in partido.pronosticos.select_for_update().all()
    }

    partido.goles_local = goles_local
    partido.goles_visitante = goles_visitante
    partido.save(update_fields=["goles_local", "goles_visitante"])

    for datos_pronostico in pronosticos:
        participante = datos_pronostico["participante"]
        goles_local_pronostico = datos_pronostico["goles_local"]
        goles_visitante_pronostico = datos_pronostico["goles_visitante"]
        pronostico = pronosticos_existentes.pop(participante.pk, None)

        if goles_local_pronostico is None:
            if pronostico is not None:
                pronostico.delete()
            continue

        if pronostico is None:
            pronostico = Pronostico(
                partido=partido,
                participante=participante,
            )

        pronostico.goles_local = goles_local_pronostico
        pronostico.goles_visitante = goles_visitante_pronostico
        pronostico.save()

    return partido


@transaction.atomic
def actualizar_resultados_dia(fecha, resultados):
    partidos_del_dia = list(
        PartidoReal.objects.select_for_update()
        .filter(fecha__date=fecha)
        .order_by("id")
    )
    partidos_por_id = {partido.pk: partido for partido in partidos_del_dia}
    resultados_por_partido = {
        resultado["partido"].pk: resultado
        for resultado in resultados
    }

    if set(resultados_por_partido) != set(partidos_por_id):
        raise ValueError(
            "La lista de resultados debe incluir todos los partidos de la fecha."
        )

    for partido_id, partido in partidos_por_id.items():
        resultado = resultados_por_partido[partido_id]
        partido.goles_local = resultado["goles_local"]
        partido.goles_visitante = resultado["goles_visitante"]

    PartidoReal.objects.bulk_update(
        partidos_del_dia,
        ["goles_local", "goles_visitante"],
    )

    pronosticos = list(
        Pronostico.objects.select_for_update()
        .select_related("partido")
        .filter(partido_id__in=partidos_por_id)
    )
    for pronostico in pronosticos:
        pronostico.calcular_resultado_pronostico()

    if pronosticos:
        Pronostico.objects.bulk_update(
            pronosticos,
            ["estado", "puntos"],
        )

    return list(
        PartidoReal.objects.filter(pk__in=partidos_por_id)
        .select_related("equipo_local", "equipo_visitante")
        .prefetch_related("pronosticos__participante")
        .order_by("id")
    )
