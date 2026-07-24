from django.db import models

from .participante import Participante
from .partido_real import PartidoReal
from django.core.exceptions import ValidationError


class Prediccion(models.Model):
    participante = models.ForeignKey(
        Participante,
        on_delete=models.CASCADE,
        related_name="predicciones"
    )

    partido = models.ForeignKey(
        PartidoReal,
        on_delete=models.CASCADE,
        related_name="predicciones"
    )

    goles_local = models.PositiveIntegerField()
    goles_visitante = models.PositiveIntegerField()

    puntos = models.PositiveIntegerField(default=0, editable=False)


    ## Meta options (No se poden repetir prediccions per a un mateix partit i participant)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["participante", "partido"],
                name="unique_prediccion_participante_partido"
            )
        ]


    def calcular_puntos(self):
        if (
            self.partido.goles_local is None
            or self.partido.goles_visitante is None
        ):
            return 0

        resultado_real_local = self.partido.goles_local
        resultado_real_visitante = self.partido.goles_visitante

        # Resultado exacto
        if (
            self.goles_local == resultado_real_local
            and self.goles_visitante == resultado_real_visitante
        ):
            return 3

        # Diferencia de goles correcta
        diferencia_predicha = self.goles_local - self.goles_visitante
        diferencia_real = (
            resultado_real_local - resultado_real_visitante
        )

        if diferencia_predicha == diferencia_real and resultado_real_local != resultado_real_visitante:
            return 2

        # Signo del resultado correcto
        if (
            (diferencia_predicha > 0 and diferencia_real > 0)
            or
            (diferencia_predicha == 0 and diferencia_real == 0)
            or
            (diferencia_predicha < 0 and diferencia_real < 0)
        ):
            return 1

        return 0

    def save(self, *args, **kwargs):
        self.puntos = self.calcular_puntos()
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.participante} - "
            f"{self.partido}: "
            f"{self.goles_local}-{self.goles_visitante}"
        )