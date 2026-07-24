import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Card,
    CardActionArea,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
    getPartidos,
    getParticipantes,
    getPredicciones,
} from "../api/api";

function obtenerClaveDia(fecha) {
    const date = new Date(fecha);

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function EditarPrediccionesDiaPage() {
    const { fecha } = useParams();
    const navigate = useNavigate();

    const [participantes, setParticipantes] = useState([]);
    const [totalPartidos, setTotalPartidos] = useState(0);
    const [conteos, setConteos] = useState({});
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;

        async function cargarDatos() {
            setCargando(true);
            setError("");

            try {
                const [partidos, listaParticipantes, predicciones] =
                    await Promise.all([
                        getPartidos(),
                        getParticipantes(),
                        getPredicciones(),
                    ]);

                if (!activo) return;

                const partidosDelDia = partidos.filter(
                    (partido) => obtenerClaveDia(partido.fecha) === fecha
                );

                const idsPartidos = new Set(
                    partidosDelDia.map((partido) => partido.id)
                );

                const conteoPorParticipante = {};

                listaParticipantes.forEach((participante) => {
                    conteoPorParticipante[participante.id] = 0;
                });

                predicciones.forEach((prediccion) => {
                    const participanteId = prediccion.participante?.id;
                    const partidoId = prediccion.partido?.id;

                    if (
                        idsPartidos.has(partidoId) &&
                        participanteId in conteoPorParticipante
                    ) {
                        conteoPorParticipante[participanteId] += 1;
                    }
                });

                setParticipantes(listaParticipantes);
                setTotalPartidos(partidosDelDia.length);
                setConteos(conteoPorParticipante);
            } catch (err) {
                console.error(err);

                if (activo) {
                    setError("No se han podido cargar los datos del día.");
                }
            } finally {
                if (activo) setCargando(false);
            }
        }

        cargarDatos();

        return () => {
            activo = false;
        };
    }, [fecha]);

    const fechaFormateada = new Date(
        `${fecha}T12:00:00`
    ).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    if (cargando) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "#3478F6" }} />
            </Box>
        );
    }

    return (
        <Box>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ mb: 1 }}
            >
                <CalendarMonthIcon sx={{ color: "#3478F6", fontSize: 32 }} />

                <Typography
                    component="h1"
                    sx={{
                        color: "#07152F",
                        fontSize: { xs: "1.5rem", sm: "2rem" },
                        fontWeight: 800,
                    }}
                >
                    Editar predicciones
                </Typography>
            </Stack>

            <Typography
                sx={{
                    color: "#53627A",
                    textTransform: "capitalize",
                    mb: 3,
                }}
            >
                {fechaFormateada} · {totalPartidos}{" "}
                {totalPartidos === 1 ? "partido" : "partidos"}
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {!error && totalPartidos === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    No se han encontrado partidos para esta fecha.
                </Alert>
            )}

            {participantes.length === 0 && !error ? (
                <Alert severity="info">
                    No hay participantes registrados.
                </Alert>
            ) : (
                <Stack spacing={1.25}>
                    {participantes.map((participante) => {
                        const realizadas = conteos[participante.id] ?? 0;

                        return (
                            <Card
                                key={participante.id}
                                elevation={0}
                                sx={{
                                    border: "1px solid #E1E7F0",
                                    borderRadius: "12px",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        borderColor: "#3478F6",
                                        boxShadow: "0 4px 14px rgb(7 21 47 / 8%)",
                                    },
                                }}
                            >
                                <CardActionArea
                                    disabled={totalPartidos === 0}
                                    onClick={() =>
                                        navigate(
                                            `/partidos/dia/${fecha}/participantes/${participante.id}/editar`
                                        )
                                    }
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={2}
                                        sx={{ p: 2 }}
                                    >
                                        <Box
                                            sx={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: "50%",
                                                flexShrink: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                backgroundColor: "#EAF1FF",
                                                color: "#123C82",
                                                fontWeight: 800,
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            {participante.nombre
                                                ?.charAt(0)
                                                ?.toUpperCase() ?? "?"}
                                        </Box>

                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                sx={{
                                                    color: "#07152F",
                                                    fontWeight: 800,
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {participante.nombre}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{ color: "#53627A" }}
                                            >
                                                Predicciones realizadas
                                            </Typography>
                                        </Box>

                                        <Box
                                            sx={{
                                                px: 1.5,
                                                py: 0.75,
                                                borderRadius: "20px",
                                                backgroundColor:
                                                    realizadas === totalPartidos
                                                        ? "#E4F7ED"
                                                        : "#EAF1FF",
                                                color:
                                                    realizadas === totalPartidos
                                                        ? "#167A4A"
                                                        : "#123C82",
                                                fontWeight: 800,
                                                fontSize: "0.9rem",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {realizadas}/{totalPartidos}
                                        </Box>

                                        <ChevronRightIcon sx={{ color: "#53627A" }} />
                                    </Stack>
                                </CardActionArea>
                            </Card>
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
}

export default EditarPrediccionesDiaPage;