from django.contrib import admin

# Register your models here.

from .models import (
    Equipo,
    Palmares,
    PartidoReal,
    Participante,
    Pronostico,
)


class PalmaresInline(admin.TabularInline):
    model = Palmares
    extra = 1


@admin.register(Participante)
class ParticipanteAdmin(admin.ModelAdmin):
    inlines = [PalmaresInline]


@admin.register(Palmares)
class PalmaresAdmin(admin.ModelAdmin):
    list_display = ("participante", "competicion", "posicion")
    list_filter = ("posicion",)
    search_fields = ("participante__nombre", "competicion", "descripcion")


admin.site.register(Equipo)
admin.site.register(PartidoReal)
admin.site.register(Pronostico)
admin.site.site_header = "Ponent Porras Admin"