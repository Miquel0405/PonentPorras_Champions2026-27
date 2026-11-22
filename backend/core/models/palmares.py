from django.db import models

from .participante import Participante


class Palmares(models.Model):
    class Posicion(models.IntegerChoices):
        PRIMERO = 1, "1.º"
        SEGUNDO = 2, "2.º"
        TERCERO = 3, "3.º"

    participante = models.ForeignKey(
        Participante,
        on_delete=models.CASCADE,
        related_name="palmares",
    )
    competicion = models.CharField(max_length=200)
    posicion = models.PositiveSmallIntegerField(choices=Posicion.choices)
    descripcion = models.TextField()

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(posicion__in=[1,2,3]),
                name="palmares_position_is_podium",
            )
        ]

    def __str__(self):
        return f"{self.participante} - {self.competicion} ({self.get_posicion_display()})"