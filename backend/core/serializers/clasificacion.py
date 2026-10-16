from rest_framework import serializers


class ClasificacionSerializer(serializers.Serializer):
    participante = serializers.IntegerField()
    nombre = serializers.CharField()
    nb_pronosticos = serializers.IntegerField()

    puntos = serializers.IntegerField()
    nb_plenos = serializers.IntegerField()
    nb_ddg = serializers.IntegerField()
    nb_1x2 = serializers.IntegerField()
    nb_errores = serializers.IntegerField()