from django.db import models
from django.core.exceptions import ValidationError
from pathlib import Path

def validar_bandera(archivo):
    extensiones_permitidas = {".svg", ".png", ".jpg", ".jpeg", ".webp"}

    extension = Path(archivo.name).suffix.lower()

    if extension not in extensiones_permitidas:
        raise ValidationError(
            "Formato no permitido. Usa SVG, PNG, JPG, JPEG o WebP."
        )
class Pais(models.Model):
    nombre = models.CharField(max_length=100)
    abreviatura = models.CharField(max_length=10, null=True, blank=True)
    bandera = models.FileField(upload_to='banderas/', null=True, blank=True, validators=[validar_bandera])
    ## Meta options (No se poden repetir noms)
    class Meta:
            constraints = [
                models.UniqueConstraint(
                    fields=["nombre"],
                    name="unique_pais_name"
                )
            ]

    def __str__(self):
        return self.nombre