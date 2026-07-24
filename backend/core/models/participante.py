from django.db import models

class Participante(models.Model):
    nombre = models.CharField(max_length=100)

    ## Meta options (No se poden repetir noms)
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["nombre"],
                name="unique_participant_name"
            )
        ]

    def __str__(self):
        return self.nombre