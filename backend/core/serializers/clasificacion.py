from rest_framework import serializers


class ClasificacionSerializer(serializers.Serializer):
    participante = serializers.IntegerField()
    nombre = serializers.CharField()
    puntos = serializers.IntegerField()
    predicciones = serializers.IntegerField()