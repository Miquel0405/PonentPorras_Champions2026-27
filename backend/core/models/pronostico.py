from django.db import models
from django.core.exceptions import ValidationError

from .participante import Participante
from .partido_real import PartidoReal


class Pronostico(models.Model):
    participante = models.ForeignKey(
        Participante,
        on_delete=models.CASCADE,
        related_name="pronosticos"
    )

    partido = models.ForeignKey(
        PartidoReal,
        on_delete=models.CASCADE,
        related_name="pronosticos"
    )

    goles_local = models.PositiveIntegerField()
    goles_visitante = models.PositiveIntegerField()

    class EstadoPorra(models.IntegerChoices):
        DEFAULT = -1, 'Pendiente de resultado'
        ERROR = 0, 'Error'
        ACIERTO_1X2 = 1, 'Acierto 1X2'
        DIFERENCIA_GOLES = 2, 'Diferencia de goles'
        ACIERTO_EXACTO = 3, 'Acierto exacto'

    estado = models.IntegerField(choices=EstadoPorra.choices, default=EstadoPorra.DEFAULT, editable=False)
    puntos = models.PositiveBigIntegerField(default=0, editable=False)

    ## Meta options (No se poden repetir pronostics per a un mateix partit i participant)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["participante", "partido"],
                name="unique_pronostico_participante_partido"
            )
        ]


    # Compara el pronostic amb el resultat real del partit i actualitza el estat i els punts
    def calcular_resultado_pronostico(self):

        partido = self.partido

        if partido.goles_local is None or partido.goles_visitante is None:
            self.estado = self.EstadoPorra.DEFAULT
            self.puntos = 0
            return

        gl_user, gv_user = self.goles_local, self.goles_visitante
        gl_real, gv_real = partido.goles_local, partido.goles_visitante

        if gl_user == gl_real and gv_user == gv_real:
            self.estado = self.EstadoPorra.ACIERTO_EXACTO
            self.puntos = 3
        elif ((gl_real - gv_real) == (gl_user - gv_user)) and gl_real != gv_real:
            self.estado = self.EstadoPorra.DIFERENCIA_GOLES
            self.puntos = 2
        elif (gl_real > gv_real and gl_user > gv_user) or (gl_real < gv_real and gl_user < gv_user) or (gl_real == gv_real and gl_user == gv_user):
            self.estado = self.EstadoPorra.ACIERTO_1X2
            self.puntos = 1
        else:
            self.estado = self.EstadoPorra.ERROR
            self.puntos = 0

    def save(self, *args, **kwargs):
        self.calcular_resultado_pronostico()
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.participante} - "
            f"{self.partido}: "
            f"{self.goles_local}-{self.goles_visitante}"
        )