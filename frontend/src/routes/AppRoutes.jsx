import { Routes, Route } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Layout from "../layouts/GlobalLayout";
import ClasificacionPage from "../pages/ClasificacionPage";
import PartidosPage from "../pages/PartidosPage";
import ParticipantePage from "../pages/ParticipantePage";
import PartidoPage from "../pages/PartidoPage";
import EditarPartidoPage from "../pages/EditarPartidoPage";
import EditarPrediccionesDiaPage from "../pages/EditarPrediccionesDiaPage";
import EditarPrediccionesParticipanteDiaPage from "../pages/EditarPrediccionesParticipanteDiaPage";
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
                {/* Selección de participantes para editar las predicciones de un día */}
                <Route
                    path="/partidos/dia/:fecha/participantes"
                    element={<EditarPrediccionesDiaPage />}
                />

                {/* Edición de las predicciones de un participante para un día */}
                <Route
                    path="/partidos/dia/:fecha/participantes/:participanteId/editar"
                    element={<EditarPrediccionesParticipanteDiaPage />}
                />
                <Route
                    path="/partidos/dia/:fecha/resultados"
                    element={<EditarResultadosDiaPage />}
                />
            </Route>

        </Routes>
    );
}

export default AppRoutes;