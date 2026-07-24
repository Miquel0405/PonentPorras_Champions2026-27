
from rest_framework import serializers

from ..models import Prediccion


class PrediccionPartidoSerializer(serializers.ModelSerializer):
    participante = serializers.SerializerMethodField()

    class Meta:
        model = Prediccion
        fields = [
            "id",
            "participante",
            "goles_local",
            "goles_visitante",
            "puntos",
        ]
        read_only_fields = ["id", "puntos"]

    def get_participante(self, obj):
        return {
            "id": obj.participante.id,
            "nombre": obj.participante.nombre,
        }

class PrediccionParticipanteSerializer(serializers.ModelSerializer):
    partido = serializers.SerializerMethodField()

    class Meta:
        model = Prediccion
        fields = [
            "id",
            "partido",
            "goles_local",
            "goles_visitante",
            "puntos",
        ]
        read_only_fields = ["id", "puntos"]

    # def get_partido(self, obj):
    #     partido = obj.partido

    #     return {
    #         "id": partido.id,
    #         "equipo_local": self.get_equipo(partido.equipo_local),
    #         "equipo_visitante": self.get_equipo(partido.equipo_visitante),
    #         "fecha": partido.fecha,
    #         "goles_local": partido.goles_local,
    #         "goles_visitante": partido.goles_visitante,
    #     }

    # def get_equipo(self, equipo):
    #     escudo = None

    #     if equipo.escudo:
    #         escudo = equipo.escudo.url

    #         request = self.context.get("request")
    #         if request:
    #             escudo = request.build_absolute_uri(escudo)

    #     return {
    #         "id": equipo.id,
    #         "nombre": equipo.nombre,
    #         "escudo": escudo,
    #     }

    
    def get_partido(self, obj):
        partido = obj.partido

        return {
            "id": partido.id,
            "equipo_local": self.get_equipo(partido.equipo_local),
            "equipo_visitante": self.get_equipo(partido.equipo_visitante),
            "fecha": partido.fecha,
            "fase": partido.fase,
            "goles_local": partido.goles_local,
            "goles_visitante": partido.goles_visitante,
        }

    def get_equipo(self, equipo):
        escudo = None

        if equipo.escudo:
            escudo = equipo.escudo.url
            request = self.context.get("request")

            if request:
                escudo = request.build_absolute_uri(escudo)

        return {
            "id": equipo.id,
            "nombre": equipo.nombre,
            "escudo": escudo,
        }

