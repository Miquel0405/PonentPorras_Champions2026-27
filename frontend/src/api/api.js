import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});


export const getClasificacion = async () => {
    const response = await api.get(
        `/clasificacion/`
    );

    return response.data;
};
export const getPartidosInicio = async () => {
    const response = await api.get(
        `/partidos-inicio/`
    );

    return response.data;
};

export const getPartidos = async () => {
    const response = await api.get(
        `/partidos/`
    );

    return response.data;
};

export const getParticipantes = async () => {
    const response = await api.get(
        `/participantes/`
    );
    return response.data;
};

export const getParticipante = async (participanteId) => {
    const response = await api.get(
        `/participantes/${participanteId}/`
    );

    return response.data;
};

export const getPartido = async (partidoId) => {
    const response = await api.get(
        `/partidos/${partidoId}/`
    );
    return response.data;
};

export const guardarEdicionPartido = async (partidoId, datos) => {
    const response = await api.post(
        `/partidos/${partidoId}/editar-completo/`,
        datos
    );

    return response.data;
};

export const getPredicciones = async () => {
    const response = await api.get("/predicciones/");
    return response.data;
};

export const guardarPrediccionesDia = async (
    participanteId,
    fecha,
    predicciones
) => {
    const response = await api.post(
        `/participantes/${participanteId}/predicciones-dia/${fecha}/`,
        { predicciones }
    );

    return response.data;
};

export const guardarResultadosDia = async (fecha, resultados) => {
    const response = await api.post(
        `/partidos/dia/${fecha}/resultados/`,
        { resultados }
    );
    return response.data;
};