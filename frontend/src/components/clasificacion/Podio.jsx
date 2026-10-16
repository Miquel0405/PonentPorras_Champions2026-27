
import {
    Avatar,
    Box,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getClasificacion } from "../../api/api";

const puestos = {
    primero: {
        numero: 1,
        color: "#E8BD65",
        fondo: "#FFF7E5",
        etiqueta: "1.º lloc",
    },
    segundo: {
        numero: 2,
        color: "#9AA7B8",
        fondo: "#F1F4F8",
        etiqueta: "2.º lloc",
    },
    tercero: {
        numero: 3,
        color: "#BC8056",
        fondo: "#FBF0E8",
        etiqueta: "3.º lloc",
    },
};

function Podio() {
    const navigate = useNavigate();

    const [clasificacion, setClasificacion] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getClasificacion()
            .then((data) => {
                setClasificacion(data);
            })
            .catch((error) => {
                console.error(error);
                setError("No s'ha pogut carregar la classificació.");
            });
    }, []);

    const irAParticipante = (participanteId) => {
        navigate(`/participantes/${participanteId}`);
    };

    if (error) {
        return (
            <Typography color="error" role="alert">
                {error}
            </Typography>
        );
    }

    if (clasificacion === null) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (clasificacion.length === 0) {
        return (
            <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    Podi i classificació
                </Typography>
                <Typography color="text.secondary">
                    Encara no hi ha participants en aquesta porra.
                </Typography>
            </Box>
        );
    }

    const primero = clasificacion[0];
    const segundo = clasificacion[1];
    const tercero = clasificacion[2];
    const resto = clasificacion.slice(3);

    const participantesPodio = [
        segundo
            ? { participante: segundo, estilo: puestos.segundo }
            : null,
        primero
            ? { participante: primero, estilo: puestos.primero }
            : null,
        tercero
            ? { participante: tercero, estilo: puestos.tercero }
            : null,
    ].filter(Boolean);

    return (
        <Box>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 3 }}
            >
                <EmojiEventsIcon sx={{ color: "#E8BD65", fontSize: 28 }} />

                <Typography
                    component="h2"
                    sx={{
                        color: "#07152F",
                        fontSize: "1.25rem",
                        fontWeight: 800,
                    }}
                >
                    Podi i classificació
                </Typography>
            </Stack>

            {/* Los tres primeros puestos */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                    alignItems: "end",
                    gap: { xs: 1, sm: 1.5 },
                }}
            >
                {participantesPodio.map(({ participante, estilo }) => {
                    const esPrimero = estilo.numero === 1;

                    return (
                        <Paper
                            key={participante.participante}
                            component="button"
                            type="button"
                            elevation={0}
                            onClick={() =>
                                irAParticipante(participante.participante)
                            }
                            aria-label={`Ver perfil de ${participante.nombre}, ${estilo.etiqueta}`}
                            sx={{
                                minWidth: 0,
                                width: "100%",
                                minHeight: esPrimero ? 220 : 190,
                                p: { xs: 1, sm: 1.5 },
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: 1,
                                border: "1px solid #E1E7F0",
                                borderTop: `${esPrimero ? 4 : 3}px solid ${estilo.color}`,
                                borderRadius: "12px",
                                bgcolor: estilo.fondo,
                                cursor: "pointer",
                                transition: "transform 150ms ease, box-shadow 150ms ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 6px 18px rgb(7 21 47 / 10%)",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#53627A",
                                    fontSize: "0.7rem",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    textAlign: "center",
                                }}
                            >
                                {estilo.etiqueta}
                            </Typography>

                            <Avatar
                                sx={{
                                    width: esPrimero ? 52 : 44,
                                    height: esPrimero ? 52 : 44,
                                    bgcolor: estilo.color,
                                    color: "#07152F",
                                    fontWeight: 800,
                                    fontSize: "1.1rem",
                                }}
                            >
                                {estilo.numero}
                            </Avatar>

                            <Typography
                                sx={{
                                    width: "100%",
                                    color: "#07152F",
                                    fontSize: esPrimero ? "0.95rem" : "0.85rem",
                                    fontWeight: 800,
                                    textAlign: "center",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {participante.nombre}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#53627A",
                                    fontSize: "0.8rem",
                                    textAlign: "center",
                                }}
                            >
                                {participante.puntos} punts
                            </Typography>
                        </Paper>
                    );
                })}
            </Box>

            {/* Resto de la clasificación */}
            {resto.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Typography
                        component="h3"
                        sx={{
                            mb: 1.5,
                            color: "#07152F",
                            fontSize: "1rem",
                            fontWeight: 800,
                        }}
                    >
                        Classificació completa
                    </Typography>

                    <Stack spacing={1}>
                        {resto.map((participante, index) => {
                            const posicion = index + 4;

                            return (
                                <Paper
                                    key={participante.participante}
                                    component="button"
                                    type="button"
                                    elevation={0}
                                    onClick={() =>
                                        irAParticipante(participante.participante)
                                    }
                                    aria-label={`Ver perfil de ${participante.nombre}, posición ${posicion}`}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1.5,
                                        width: "100%",
                                        minWidth: 0,
                                        p: 1.5,
                                        textAlign: "left",
                                        color: "#07152F",
                                        backgroundColor: "#F0F5FD",
                                        border: "1px solid #DCE6F5",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        transition: "background-color 150ms ease",
                                        "&:hover": {
                                            backgroundColor: "#E1EBFA",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flexShrink: 0,
                                            width: 32,
                                            height: 32,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: "8px",
                                            backgroundColor: "#DCE8FA",
                                            color: "#123C82",
                                            fontSize: "0.85rem",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {posicion}
                                    </Box>

                                    <Typography
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {participante.nombre}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            flexShrink: 0,
                                            color: "#123C82",
                                            fontSize: "0.875rem",
                                            fontWeight: 800,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {participante.puntos} pts
                                    </Typography>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Box>
            )}
        </Box>
    );
}

export default Podio;
