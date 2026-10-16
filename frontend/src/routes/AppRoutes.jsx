import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Layout from "../layouts/GlobalLayout";
import ClasificacionPage from "../pages/ClasificacionPage";
import PartidosPage from "../pages/PartidosPage";
import ParticipantePage from "../pages/ParticipantePage";
import PartidoPage from "../pages/PartidoPage";
import EditarPartidoPage from "../pages/EditarPartidoPage";
import EditarPronosticosDiaPage from "../pages/EditarPronosticosDiaPage";
import EditarPronosticosParticipanteDiaPage from "../pages/EditarPronosticosParticipanteDiaPage";
import EditarResultadosDiaPage from "../pages/EditarResultadosDiaPage";

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Layout />}
            >
                {/* Página de inicio */}
                <Route
                    path="/"
                    element={<HomePage />}
                />

                {/* Página de clasificación */}
                <Route
                    path="/clasificacion"
                    element={<ClasificacionPage />}
                />
                
                {/* Página de partidos */}
                <Route
                    path="/partidos"
                    element={<PartidosPage />}
                />
                
                {/* Página de participante */}
                <Route
                    path="/participantes/:participanteId"
                    element={<ParticipantePage />}
                />
                
                {/* Página de partido */}
                <Route
                    path="/partidos/:partidoId"
                    element={<PartidoPage />}
                />
                {/* Página de edición de partido */}
                <Route
                    path="/partidos/:partidoId/editar"
                    element={<EditarPartidoPage />}
                />
                {/* Selección de participante para editar las porras de un día */}
                <Route
                    path="/partidos/dia/:fecha/participantes"
                    element={<EditarPronosticosDiaPage />}
                />

                {/* Edición de las porras de un participante para un día */}
                <Route
                    path="/partidos/dia/:fecha/participantes/:participanteId/editar"
                    element={<EditarPronosticosParticipanteDiaPage />}
                />

                {/* Edición de los resultados reales de un día */}
                <Route
                    path="/partidos/dia/:fecha/resultados"
                    element={<EditarResultadosDiaPage />}
                />
            </Route>

        </Routes>
    );
}

export default AppRoutes;