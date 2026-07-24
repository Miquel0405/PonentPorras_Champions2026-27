import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import {
    getPartido,
    getParticipantes,
    guardarEdicionPartido,
} from "../api/api";

import PartidoBanner from "../components/partidos/PartidoBanner";
import PartidoPorras from "../components/partidos/PartidoPorras";

function EditarPartidoPage() {
    const { partidoId } = useParams();
    const navigate = useNavigate();

    const [partido, setPartido] = useState(null);
    const [participantes, setParticipantes] = useState([]);
    const [resultado, setResultado] = useState({
        goles_local: null,
        goles_visitante: null,
    });
    const [valoresPredicciones, setValoresPredicciones] = useState({});
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let activo = true;

        const cargarDatos = async () => {
            setCargando(true);
            setError("");

            try {
                const [datosPartido, datosParticipantes] = await Promise.all([
                    getPartido(partidoId),
                    getParticipantes(),
                ]);

                if (!activo) return;

                setPartido(datosPartido);
                setParticipantes(datosParticipantes);

                setResultado({
                    goles_local: datosPartido.goles_local,
                    goles_visitante: datosPartido.goles_visitante,
                });

                const prediccionesExistentes = new Map(
                    (datosPartido.predicciones ?? []).map((prediccion) => [
                        prediccion.participante.id,
                        prediccion,
                    ])
                );

                const valoresIniciales = {};

                datosParticipantes.forEach((participante) => {
                    const prediccion = prediccionesExistentes.get(participante.id);

                    valoresIniciales[participante.id] = {
                        goles_local: prediccion?.goles_local ?? null,
                        goles_visitante: prediccion?.goles_visitante ?? null,
                    };
                });

                setValoresPredicciones(valoresIniciales);
            } catch (err) {
                console.error(err);

                if (activo) {
                    setError("No se han podido cargar los datos del partido.");
                }
            } finally {
                if (activo) setCargando(false);
            }
        };

        cargarDatos();

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

    const handlePrediccionChange = (participanteId, campo, valor) => {
        setValoresPredicciones((actual) => ({
            ...actual,
            [participanteId]: {
                ...actual[participanteId],
                [campo]: valor,
            },
        }));
    };

    const handleGuardar = async () => {
        setError("");
        setGuardando(true);

        try {
            const datos = {
                goles_local: resultado.goles_local,
                goles_visitante: resultado.goles_visitante,
                predicciones: participantes.map((participante) => ({
                    participante_id: participante.id,
                    goles_local:
                        valoresPredicciones[participante.id]?.goles_local ?? null,
                    goles_visitante:
                        valoresPredicciones[participante.id]?.goles_visitante ?? null,
                })),
            };

            await guardarEdicionPartido(partidoId, datos);

            navigate(`/partidos/${partidoId}`);
        } catch (err) {
            console.error(err);

            const detalle =
                err.response?.data?.detail ??
                err.response?.data?.predicciones ??
                "No se han podido guardar los cambios.";

            setError(
                typeof detalle === "string"
                    ? detalle
                    : "Revisa los datos introducidos e inténtalo de nuevo."
            );
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: "#3478F6" }} />
            </Box>
        );
    }

    if (!partido) {
        return (
            <Box>
                <Alert severity="error">
                    {error || "No se ha podido cargar el partido."}
                </Alert>

                <Button
                    onClick={() => navigate(`/partidos/${partidoId}`)}
                    sx={{ mt: 2, textTransform: "none" }}
                >
                    Volver al partido
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Typography
                component="h1"
                sx={{
                    color: "#07152F",
                    fontSize: { xs: "1.6rem", sm: "2rem" },
                    fontWeight: 800,
                    mb: 2.5,
                }}
            >
                Editar partido
            </Typography>

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
                valoresPredicciones={valoresPredicciones}
                onPrediccionChange={handlePrediccionChange}
            />

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            <Stack
                direction={{ xs: "column-reverse", sm: "row" }}
                justifyContent="flex-end"
                spacing={1.5}
                sx={{ mt: 3, mb: 4 }}
            >
                <Button
                    variant="outlined"
                    startIcon={<CloseOutlinedIcon />}
                    disabled={guardando}
                    onClick={() => navigate(`/partidos/${partidoId}`)}
                    sx={{
                        color: "#123C82",
                        borderColor: "#E1E7F0",
                        textTransform: "none",
                        fontWeight: 700,
                    }}
                >
                    Cancelar
                </Button>

                <Button
                    variant="contained"
                    startIcon={
                        guardando
                            ? <CircularProgress size={18} color="inherit" />
                            : <SaveOutlinedIcon />
                    }
                    disabled={guardando || participantes.length === 0}
                    onClick={handleGuardar}
                    sx={{
                        backgroundColor: "#123C82",
                        "&:hover": { backgroundColor: "#07152F" },
                        textTransform: "none",
                        fontWeight: 700,
                    }}
                >
                    {guardando ? "Guardando..." : "Guardar cambios"}
                </Button>
            </Stack>
        </Box>
    );
}

export default EditarPartidoPage;