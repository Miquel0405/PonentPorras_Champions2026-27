import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    getPartido,
    getParticipantes,
    guardarEdicionPartido,
} from "../api/api";
import PartidoBanner from "../components/partidos/PartidoBanner";
import PartidoPorras from "../components/partidos/PartidoPorras";

function extraerMensajeError(error) {
    const datos = error.response?.data;
    if (!datos) return "No s'han pogut guardar els canvis.";
    if (typeof datos === "string") return datos;

    const extraerMensajes = (valor) => {
        if (typeof valor === "string") return [valor];
        if (Array.isArray(valor)) return valor.flatMap(extraerMensajes);
        if (valor && typeof valor === "object") {
            return Object.values(valor).flatMap(extraerMensajes);
        }
        return [];
    };

    const mensajes = extraerMensajes(datos);
    return mensajes.length
        ? mensajes.join(" ")
        : "No s'han pogut guardar els canvis.";
}

function EditarPartidoPage() {
    const { partidoId } = useParams();
    const navigate = useNavigate();

    const [partido, setPartido] = useState(null);
    const [participantes, setParticipantes] = useState([]);
    const [resultado, setResultado] = useState({
        goles_local: null,
        goles_visitante: null,
    });
    const [valoresPronosticos, setValoresPronosticos] = useState({});
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let activo = true;

        Promise.all([getPartido(partidoId), getParticipantes()])
            .then(([datosPartido, datosParticipantes]) => {
                if (!activo) return;

                setPartido(datosPartido);
                setParticipantes(datosParticipantes);
                setResultado({
                    goles_local: datosPartido.goles_local,
                    goles_visitante: datosPartido.goles_visitante,
                });

                const pronosticosExistentes = new Map(
                    (datosPartido.pronosticos ?? []).map((pronostico) => [
                        pronostico.participante.id,
                        pronostico,
                    ])
                );

                setValoresPronosticos(
                    Object.fromEntries(
                        datosParticipantes.map((participante) => {
                            const pronostico = pronosticosExistentes.get(
                                participante.id
                            );

                            return [
                                participante.id,
                                {
                                    goles_local: pronostico?.goles_local ?? null,
                                    goles_visitante:
                                        pronostico?.goles_visitante ?? null,
                                },
                            ];
                        })
                    )
                );
            })
            .catch((error) => {
                console.error(error);
                if (activo) {
                    setError("No s'han pogut carregar les dades del partit.");
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, [partidoId]);

    const handleResultadoChange = (campo, valor) => {
        setResultado((actual) => ({
            ...actual,
            [campo]: valor,
        }));
    };

    const handlePronosticoChange = (participanteId, campo, valor) => {
        setValoresPronosticos((actual) => ({
            ...actual,
            [participanteId]: {
                ...actual[participanteId],
                [campo]: valor,
            },
        }));
    };

    const handleGuardar = async () => {
        setError(null);
        setGuardando(true);

        try {
            await guardarEdicionPartido(partidoId, {
                goles_local: resultado.goles_local,
                goles_visitante: resultado.goles_visitante,
                pronosticos: participantes.map((participante) => ({
                    participante_id: participante.id,
                    goles_local:
                        valoresPronosticos[participante.id]?.goles_local ?? null,
                    goles_visitante:
                        valoresPronosticos[participante.id]?.goles_visitante ?? null,
                })),
            });
            navigate(`/partidos/${partidoId}`);
        } catch (error) {
            console.error(error);
            setError(extraerMensajeError(error));
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <Box
                sx={{
                    minHeight: 240,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <CircularProgress sx={{ color: "#3478F6" }} />
                <Typography sx={{ color: "#53627A", fontSize: "0.9rem" }}>
                    Carregant partit...
                </Typography>
            </Box>
        );
    }

    if (error || !partido) {
        return (
            <Paper
                role="alert"
                elevation={0}
                sx={{
                    p: 3,
                    color: "#B42318",
                    bgcolor: "#FFF5F5",
                    border: "1px solid #F3C7C7",
                    borderRadius: "12px",
                }}
            >
                <Typography sx={{ fontWeight: 700 }}>
                    No s'ha pogut carregar el partit
                </Typography>
                <Typography sx={{ mt: 0.5 }}>
                    {error ?? "El partit no existeix."}
                </Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                    flexWrap: "wrap",
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        color: "#07152F",
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        fontWeight: 800,
                    }}
                >
                    Editar partit
                </Typography>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                        component={Link}
                        to={`/partidos/${partidoId}`}
                        variant="outlined"
                        startIcon={<BackIcon />}
                        disabled={guardando}
                        sx={{
                            color: "#F3F6FC",
                            borderColor: "#123C82",
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor: "#3478F6",
                            },
                        }}
                    >
                        Tornar al partit
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={
                            guardando ? (
                                <CircularProgress size={18} color="inherit" />
                            ) : (
                                <SaveOutlinedIcon />
                            )
                        }
                        onClick={handleGuardar}
                        disabled={guardando}
                        sx={{
                            backgroundColor: "#123C82",
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor: "#07152F",
                            },
                        }}
                    >
                        {guardando ? "Guardant..." : "Guardar canvis"}
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" role="alert" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <PartidoBanner
                partido={partido}
                editable
                golesLocal={resultado.goles_local}
                golesVisitante={resultado.goles_visitante}
                onResultadoChange={handleResultadoChange}
            />

            <PartidoPorras
                editable
                participantes={participantes}
                valoresPronosticos={valoresPronosticos}
                onPronosticoChange={handlePronosticoChange}
            />
        </Box>
    );
}

export default EditarPartidoPage;