from django.db import models

from .equipo import Equipo

class PartidoReal(models.Model):
    equipo_local = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='partidos_local')
    equipo_visitante = models.ForeignKey(Equipo, on_delete=models.CASCADE, related_name='partidos_visitante')

    fecha = models.DateTimeField()
    fase = models.CharField(max_length=50, null=True, blank=True)
    goles_local = models.PositiveIntegerField(null=True, blank=True)
    goles_visitante = models.PositiveIntegerField(null=True, blank=True)


    ## Meta options (No se pot jugar contra un mateix)
    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(equipo_local=models.F("equipo_visitante")),
                name="local_different_from_visitante"
            )
        ]

    ## Sobreescritura de save per a actualitzar punts quan es fica el resultat del partit
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        for pronostico in self.pronosticos.all():
            pronostico.save(update_fields=["estado", "puntos"])

    def __str__(self):
        return f"{self.equipo_local} vs {self.equipo_visitante}"