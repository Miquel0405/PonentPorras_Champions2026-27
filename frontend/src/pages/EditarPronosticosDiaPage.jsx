import {
    Box,
    Button,
    CircularProgress,
    Chip,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getParticipantes, getPartidos, getPronosticos } from "../api/api";
import PageBackButton from "../components/common/PageBackButton";

function formatearFecha(fecha) {
    const [year, month, day] = fecha.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("cat-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function EditarPronosticosDiaPage() {
    const { fecha } = useParams();
    const [participantes, setParticipantes] = useState([]);
    const [conteosPronosticos, setConteosPronosticos] = useState({});
    const [cantidadPartidos, setCantidadPartidos] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let activo = true;

        Promise.all([
            getParticipantes(),
            getPartidos({ fecha }),
            getPronosticos({ fecha }),
        ])
            .then(([datosParticipantes, partidos, pronosticos]) => {
                if (!activo) return;
                setParticipantes(datosParticipantes);
                setCantidadPartidos(partidos.length);
                setConteosPronosticos(
                    pronosticos.reduce((conteos, pronostico) => {
                        const participanteId = pronostico.participante.id;
                        conteos[participanteId] =
                            (conteos[participanteId] ?? 0) + 1;
                        return conteos;
                    }, {})
                );
            })
            .catch((error) => {
                console.error(error);
                if (activo) {
                    setError("No s'han pogut carregar les dades del dia.");
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, [fecha]);

    return (
        <Box>
            <PageBackButton to="/partidos">Tornar als partits</PageBackButton>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        component="h1"
                        sx={{
                            color: "#FFFFFF",
                            fontSize: { xs: "1.5rem", sm: "2rem" },
                            fontWeight: 800,
                        }}
                    >
                        Editar porres del dia
                    </Typography>
                    <Typography sx={{ color: "#DCE6F5", mt: 0.5, textTransform: "capitalize" }}>
                        {formatearFecha(fecha)}
                    </Typography>
                </Box>

            </Stack>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    border: "1px solid #E1E7F0",
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0 2px 10px rgb(7 21 47 / 6%)",
                }}
            >
                {cargando ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                        <CircularProgress sx={{ color: "#3478F6" }} />
                    </Box>
                ) : error ? (
                    <Typography role="alert" sx={{ color: "#B42318" }}>
                        {error}
                    </Typography>
                ) : cantidadPartidos === 0 ? (
                    <Typography sx={{ py: 3, color: "#53627A", textAlign: "center" }}>
                        No hi ha partits en aquesta data.
                    </Typography>
                ) : participantes.length === 0 ? (
                    <Typography sx={{ py: 3, color: "#53627A", textAlign: "center" }}>
                        No hi ha participants registrats.
                    </Typography>
                ) : (
                    <>
                        <Typography sx={{ color: "#53627A", mb: 2 }}>
                            Selecciona un participant per editar les seves porres
                            dels {cantidadPartidos} partits d'aquest dia.
                        </Typography>
                        <Stack spacing={1}>
                            {participantes.map((participante) => {
                                const cantidad =
                                    conteosPronosticos[participante.id] ?? 0;
                                const completo = cantidad === cantidadPartidos;

                                return (
                                <Button
                                    key={participante.id}
                                    component={Link}
                                    to={`/partidos/dia/${fecha}/participantes/${participante.id}/editar`}
                                    variant="outlined"
                                    startIcon={<SportsSoccerIcon />}
                                    sx={{
                                        justifyContent: "flex-start",
                                        gap: 1,
                                        py: 1.25,
                                        px: 2,
                                        borderColor: "#E1E7F0",
                                        borderRadius: "10px",
                                        color: "#07152F",
                                        fontWeight: 700,
                                        textTransform: "none",
                                        "&:hover": {
                                            borderColor: "#3478F6",
                                            backgroundColor: "#F3F6FC",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            width: "100%",
                                            gap: 1,
                                        }}
                                    >
                                        <Box sx={{ flex: 1, textAlign: "left" }}>
                                            {participante.nombre}
                                        </Box>
                                        <Chip
                                            size="small"
                                            label={`${cantidad}/${cantidadPartidos} porres`}
                                            sx={{
                                                fontWeight: 700,
                                                backgroundColor: completo
                                                    ? "#E8F7EF"
                                                    : "#F3F6FC",
                                                color: completo
                                                    ? "#16804A"
                                                    : "#53627A",
                                            }}
                                        />
                                    </Box>
                                </Button>
                                );
                            })}
                        </Stack>
                    </>
                )}
            </Paper>
        </Box>
    );
}

export default EditarPronosticosDiaPage;
