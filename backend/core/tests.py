from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Equipo, PartidoReal, Participante, Pronostico


class EditarPartidoCompletoTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.equipo_local = Equipo.objects.create(nombre="Local")
        self.equipo_visitante = Equipo.objects.create(nombre="Visitante")
        self.partido = PartidoReal.objects.create(
            equipo_local=self.equipo_local,
            equipo_visitante=self.equipo_visitante,
            fecha=timezone.now(),
            goles_local=1,
            goles_visitante=0,
        )
        self.participante_actual = Participante.objects.create(nombre="Actual")
        self.participante_borrado = Participante.objects.create(nombre="Borrado")
        self.participante_nuevo = Participante.objects.create(nombre="Nuevo")
        self.pronostico_actual = Pronostico.objects.create(
            partido=self.partido,
            participante=self.participante_actual,
            goles_local=1,
            goles_visitante=0,
        )
        self.pronostico_borrado = Pronostico.objects.create(
            partido=self.partido,
            participante=self.participante_borrado,
            goles_local=0,
            goles_visitante=0,
        )

    def test_actualiza_marcador_y_porras_en_una_solicitud(self):
        response = self.client.post(
            f"/api/partidos/{self.partido.pk}/editar-completo/",
            {
                "goles_local": 2,
                "goles_visitante": 0,
                "pronosticos": [
                    {
                        "participante_id": self.participante_actual.pk,
                        "goles_local": 2,
                        "goles_visitante": 0,
                    },
                    {
                        "participante_id": self.participante_borrado.pk,
                        "goles_local": None,
                        "goles_visitante": None,
                    },
                    {
                        "participante_id": self.participante_nuevo.pk,
                        "goles_local": 0,
                        "goles_visitante": 2,
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.partido.refresh_from_db()
        self.pronostico_actual.refresh_from_db()

        self.assertEqual(
            (self.partido.goles_local, self.partido.goles_visitante),
            (2, 0),
        )
        self.assertEqual(
            self.pronostico_actual.estado,
            Pronostico.EstadoPorra.ACIERTO_EXACTO,
        )
        self.assertEqual(self.pronostico_actual.puntos, 3)
        self.assertFalse(
            Pronostico.objects.filter(
                pk=self.pronostico_borrado.pk,
            ).exists()
        )
        self.assertTrue(
            Pronostico.objects.filter(
                partido=self.partido,
                participante=self.participante_nuevo,
                goles_local=0,
                goles_visitante=2,
                estado=Pronostico.EstadoPorra.ERROR,
                puntos=0,
            ).exists()
        )

    def test_rechaza_porra_con_un_solo_gol_sin_actualizar_partido(self):
        response = self.client.post(
            f"/api/partidos/{self.partido.pk}/editar-completo/",
            {
                "goles_local": 3,
                "goles_visitante": 1,
                "pronosticos": [
                    {
                        "participante_id": self.participante_actual.pk,
                        "goles_local": None,
                        "goles_visitante": 1,
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.partido.refresh_from_db()
        self.assertEqual(
            (self.partido.goles_local, self.partido.goles_visitante),
            (1, 0),
        )

    def test_crea_y_elimina_porras_de_un_participante_para_un_dia(self):
        url = (
            f"/api/participantes/{self.participante_nuevo.pk}/"
            f"pronosticos-dia/{self.partido.fecha.date().isoformat()}/"
        )
        response = self.client.post(
            url,
            {
                "pronosticos": [
                    {
                        "partido_id": self.partido.pk,
                        "goles_local": 1,
                        "goles_visitante": 0,
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            Pronostico.objects.filter(
                partido=self.partido,
                participante=self.participante_nuevo,
                goles_local=1,
                goles_visitante=0,
                puntos=3,
            ).exists()
        )

        response = self.client.post(
            url,
            {
                "pronosticos": [
                    {
                        "partido_id": self.partido.pk,
                        "goles_local": 0,
                        "goles_visitante": 0,
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        pronostico_actualizado = Pronostico.objects.get(
            partido=self.partido,
            participante=self.participante_nuevo,
        )
        self.assertEqual(
            (pronostico_actualizado.goles_local, pronostico_actualizado.goles_visitante),
            (0, 0),
        )
        self.assertEqual(
            pronostico_actualizado.estado,
            Pronostico.EstadoPorra.ERROR,
        )
        self.assertEqual(pronostico_actualizado.puntos, 0)

        response = self.client.post(
            url,
            {
                "pronosticos": [
                    {
                        "partido_id": self.partido.pk,
                        "goles_local": None,
                        "goles_visitante": None,
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(
            Pronostico.objects.filter(
                partido=self.partido,
                participante=self.participante_nuevo,
            ).exists()
        )

    def test_edicion_dia_requiere_todos_los_partidos_de_la_fecha(self):
        segundo_partido = PartidoReal.objects.create(
            equipo_local=self.equipo_visitante,
            equipo_visitante=Equipo.objects.create(nombre="Otro"),
            fecha=self.partido.fecha,
            goles_local=None,
            goles_visitante=None,
        )
        url = (
            f"/api/participantes/{self.participante_actual.pk}/"
            f"pronosticos-dia/{self.partido.fecha.date().isoformat()}/"
        )

        response = self.client.post(
            url,
            {
                "pronosticos": [
                    {
                        "partido_id": self.partido.pk,
                        "goles_local": 2,
                        "goles_visitante": 1,
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.pronostico_actual.refresh_from_db()
        self.assertEqual(self.pronostico_actual.goles_local, 1)
        self.assertFalse(
            Pronostico.objects.filter(
                partido=segundo_partido,
                participante=self.participante_actual,
            ).exists()
        )

    def test_filtros_de_fecha_incluyen_partidos_con_hora(self):
        fecha = self.partido.fecha.date().isoformat()

        partidos_response = self.client.get(
            "/api/partidos/",
            {"fecha": fecha},
        )
        pronosticos_response = self.client.get(
            "/api/pronosticos/",
            {"fecha": fecha},
        )

        self.assertEqual(partidos_response.status_code, 200)
        self.assertEqual(pronosticos_response.status_code, 200)
        self.assertEqual(len(partidos_response.data), 1)
        self.assertEqual(len(pronosticos_response.data), 2)

    def test_actualiza_resultados_del_dia_y_recalcula_porras(self):
        fecha = self.partido.fecha.date().isoformat()
        response = self.client.post(
            f"/api/partidos/dia/{fecha}/resultados/",
            {
                "resultados": [
                    {
                        "partido_id": self.partido.pk,
                        "goles_local": 2,
                        "goles_visitante": 0,
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.partido.refresh_from_db()
        self.pronostico_actual.refresh_from_db()
        self.assertEqual(
            (self.partido.goles_local, self.partido.goles_visitante),
            (2, 0),
        )
        self.assertEqual(
            self.pronostico_actual.estado,
            Pronostico.EstadoPorra.ACIERTO_1X2,
        )
        self.assertEqual(self.pronostico_actual.puntos, 1)

    def test_edicion_de_resultados_rechaza_resultado_incompleto(self):
        fecha = self.partido.fecha.date().isoformat()
        response = self.client.post(
            f"/api/partidos/dia/{fecha}/resultados/",
            {
                "resultados": [
                    {
                        "partido_id": self.partido.pk,
                        "goles_local": 2,
                        "goles_visitante": None,
                    },
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.partido.refresh_from_db()
        self.assertEqual(
            (self.partido.goles_local, self.partido.goles_visitante),
            (1, 0),
        )
