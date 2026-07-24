from django.contrib import admin

# Register your models here.

from .models import (
    Equipo,
    PartidoReal,
    Participante,
    Prediccion,
    Pais,
)


admin.site.register(Equipo)
admin.site.register(PartidoReal)
admin.site.register(Participante)
admin.site.register(Prediccion)
admin.site.register(Pais)
admin.site.site_header = "Ponent Porras Admin"