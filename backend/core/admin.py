from django.contrib import admin

# Register your models here.

from .models import (
    Equipo,
    PartidoReal,
    Participante,
    Pronostico,
)


admin.site.register(Equipo)
admin.site.register(PartidoReal)
admin.site.register(Participante)
admin.site.register(Pronostico)
admin.site.site_header = "Ponent Porras Admin"