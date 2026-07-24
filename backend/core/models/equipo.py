from django.db import models
from django.core.exceptions import ValidationError
from pathlib import Path

def validar_escudo(archivo):
    extensiones_permitidas = {".svg", ".png", ".jpg", ".jpeg", ".webp"}

    extension = Path(archivo.name).suffix.lower()

    if extension not in extensiones_permitidas:
        raise ValidationError(
            "Formato no permitido. Usa SVG, PNG, JPG, JPEG o WebP."
        )

class Equipo(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    abreviatura = models.CharField(max_length=10, null=True, blank=True)
    pais = models.ForeignKey('Pais', on_delete=models.SET_NULL, null=True, blank=True)
    escudo = models.FileField(upload_to='escudos/', null=True, blank=True, validators=[validar_escudo])
    apodo_puskas = models.CharField(max_length=100, null=True, blank=True)

    ## Meta options (No se poden repetir noms de equips)
    class Meta:
            constraints = [
                models.UniqueConstraint(
                    fields=["nombre"],
                    name="unique_equipo_name"
                )
            ]

    def __str__(self):
        return self.nombre