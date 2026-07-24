import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { getPartidos, guardarResultadosDia } from "../api/api";
import EscudoEquipo from "../components/partidos/EscudoEquipo";


const obtenerClaveDia = (fecha) => {
    const fechaPartido = new Date(fecha);

    const año = fechaPartido.getFullYear();
    const mes = String(fechaPartido.getMonth() + 1).padStart(2, "0");
    const dia = String(fechaPartido.getDate()).padStart(2, "0");

    return `${año}-${mes}-${dia}`;
};

const formatearDia = (fecha) => {
    const [año, mes, dia] = fecha.split("-");

    return new Date(
        Number(año),
        Number(mes) - 1,
        Number(dia),
        12
    ).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const obtenerMensajeError = (error) => {
    const detalle = error.response?.data?.detail;

    if (detalle) {
        return detalle;
    }

    return "No se pudieron guardar los resultados. Inténtalo de nuevo.";
};


export default function EditarResultadosDiaPage() {
    const { fecha } = useParams();
    const navigate = useNavigate();

    const [partidos, setPartidos] = useState([]);
    const [valores, setValores] = useState({});
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [erroresValidacion, setErroresValidacion] = useState({});
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        let activo = true;

        const cargarPartidos = async () => {
            setCargando(true);
            setError("");

            try {
                const datos = await getPartidos();

                if (!activo) return;

                const partidosDelDia = datos
                    .filter(
                        (partido) =>
                            obtenerClaveDia(partido.fecha) === fecha
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.fecha) - new Date(b.fecha)
                    );

                const valoresIniciales = {};

                partidosDelDia.forEach((partido) => {
                    valoresIniciales[partido.id] = {
                        goles_local:
                            partido.goles_local ?? "",
                        goles_visitante:
                            partido.goles_visitante ?? "",
                    };
                });

                setPartidos(partidosDelDia);
                setValores(valoresIniciales);
            } catch (err) {
                if (activo) {
                    setError(
                        "No se pudieron cargar los partidos. Comprueba la conexión con el servidor."
                    );
                }
            } finally {
                if (activo) {
                    setCargando(false);
                }
            }
        };

        cargarPartidos();

        return () => {
            activo = false;
        };
    }, [fecha]);

    const handleChange = (partidoId, campo, valor) => {
        setValores((actuales) => ({
            ...actuales,
            [partidoId]: {
                ...actuales[partidoId],
                [campo]: valor,
            },
        }));

        setErroresValidacion((actuales) => ({
            ...actuales,
            [partidoId]: "",
        }));

        setMensaje("");
    };

    const handleGuardar = async () => {
        setMensaje("");
        setError("");

        const nuevosErrores = {};
        const resultados = [];

        for (const partido of partidos) {
            const valor = valores[partido.id];

            const localVacio = valor.goles_local === "";
            const visitanteVacio = valor.goles_visitante === "";

            if (localVacio !== visitanteVacio) {
                nuevosErrores[partido.id] =
                    "Introduce los goles de ambos equipos o deja ambos campos vacíos.";
                continue;
            }

            if (!localVacio) {
                const golesLocal = Number(valor.goles_local);
                const golesVisitante = Number(valor.goles_visitante);

                if (
                    !Number.isInteger(golesLocal) ||
                    !Number.isInteger(golesVisitante) ||
                    golesLocal < 0 ||
                    golesVisitante < 0
                ) {
                    nuevosErrores[partido.id] =
                        "Los goles deben ser números enteros no negativos.";
                    continue;
                }

                resultados.push({
                    partido_id: partido.id,
                    goles_local: golesLocal,
                    goles_visitante: golesVisitante,
                });
            } else {
                resultados.push({
                    partido_id: partido.id,
                    goles_local: null,
                    goles_visitante: null,
                });
            }
        }

        setErroresValidacion(nuevosErrores);

        if (Object.keys(nuevosErrores).length > 0) {
            setError(
                "Revisa los resultados señalados antes de guardar."
            );
            return;
        }

        setGuardando(true);

        try {
            await guardarResultadosDia(fecha, resultados);
            navigate("/partidos", {
                state: {
                    mensaje:
                        "Los resultados del día se han guardado correctamente.",
                },
            });
        } catch (err) {
            setError(obtenerMensajeError(err));
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 8,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto",
                px: { xs: 1.5, sm: 3 },
                py: 3,
            }}
        >
            <Stack spacing={3}>
                <Box>
                    <Button
                        onClick={() => navigate("/partidos")}
                        startIcon={<CloseOutlinedIcon />}
                        sx={{
                            mb: 1,
                            textTransform: "none",
                            color: "#53627A",
                        }}
                    >
                        Volver a los partidos
                    </Button>

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mb: 1 }}
                    >
                        <CalendarMonthIcon
                            sx={{ color: "#3478F6", fontSize: 30 }}
                        />

                        <Typography
                            variant="h5"
                            component="h1"
                            sx={{
                                fontWeight: 800,
                                color: "#07152F",
                            }}
                        >
                            Resultados reales
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body1"
                        sx={{
                            color: "#53627A",
                            textTransform: "capitalize",
                        }}
                    >
                        {formatearDia(fecha)}
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{ color: "#53627A", mt: 0.5 }}
                    >
                        {partidos.length}{" "}
                        {partidos.length === 1
                            ? "partido"
                            : "partidos"}
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {mensaje && (
                    <Alert severity="success">
                        {mensaje}
                    </Alert>
                )}

                {partidos.length === 0 ? (
                    <Alert severity="info">
                        No hay partidos programados para esta fecha.
                    </Alert>
                ) : (
                    <Stack spacing={2}>
                        {partidos.map((partido) => {
                            const valor = valores[partido.id] ?? {
                                goles_local: "",
                                goles_visitante: "",
                            };

                            const errorPartido =
                                erroresValidacion[partido.id];

                            return (
                                <Paper
                                    key={partido.id}
                                    elevation={0}
                                    sx={{
                                        p: { xs: 1.5, sm: 2.5 },
                                        border: "1px solid #E1E7F0",
                                        borderRadius: "12px",
                                        boxShadow:
                                            "0 2px 8px rgba(7,21,47,0.04)",
                                    }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        sx={{ mb: 2 }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "#53627A",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {formatearHora(partido.fecha)}
                                        </Typography>

                                        {partido.fase && (
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "#53627A",
                                                    textAlign: "right",
                                                }}
                                            >
                                                {partido.fase}
                                            </Typography>
                                        )}
                                    </Stack>

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: {
                                                xs: "minmax(0, 1fr) 140px minmax(0, 1fr)",
                                                sm: "minmax(0, 1fr) 170px minmax(0, 1fr)",
                                            },
                                            alignItems: "center",
                                            gap: { xs: 1, sm: 2 },
                                        }}
                                    >
                                        <Stack
                                            spacing={1}
                                            alignItems="center"
                                            sx={{ minWidth: 0 }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 42,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <EscudoEquipo
                                                    equipo={partido.equipo_local}
                                                />
                                            </Box>

                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#07152F",
                                                    textAlign: "center",
                                                    fontSize: {
                                                        xs: "0.8rem",
                                                        sm: "0.95rem",
                                                    },
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {partido.equipo_local.nombre}
                                            </Typography>
                                        </Stack>

                                        <Stack
                                            direction="row"
                                            spacing={0.75}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <TextField
                                                value={valor.goles_local}
                                                onChange={(e) =>
                                                    handleChange(
                                                        partido.id,
                                                        "goles_local",
                                                        e.target.value
                                                    )
                                                }
                                                type="number"
                                                size="small"
                                                inputProps={{
                                                    min: 0,
                                                    step: 1,
                                                    inputMode: "numeric",
                                                }}
                                                aria-label={`Goles de ${partido.equipo_local.nombre}`}
                                                sx={{
                                                    width: { xs: 48, sm: 60 },
                                                    "& input": {
                                                        textAlign: "center",
                                                        fontWeight: 800,
                                                        fontSize: "1.1rem",
                                                        p: 1,
                                                    },
                                                }}
        
                                                error={Boolean(errorPartido)}
                                            />

                                            <Typography
                                                sx={{
                                                    color: "#53627A",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                -
                                            </Typography>

                                            <TextField
                                                value={valor.goles_visitante}
                                                onChange={(e) =>
                                                    handleChange(
                                                        partido.id,
                                                        "goles_visitante",
                                                        e.target.value
                                                    )
                                                }
                                                type="number"
                                                size="small"
                                                inputProps={{
                                                    min: 0,
                                                    step: 1,
                                                    inputMode: "numeric",
                                                }}
                                                aria-label={`Goles de ${partido.equipo_visitante.nombre}`}
                                                sx={{
                                                    width: { xs: 48, sm: 60 },
                                                    "& input": {
                                                        textAlign: "center",
                                                        fontWeight: 800,
                                                        fontSize: "1.1rem",
                                                        p: 1,
                                                    },
                                                }}
                                                error={Boolean(errorPartido)}
                                            />
                                        </Stack>

                                        <Stack
                                            spacing={1}
                                            alignItems="center"
                                            sx={{ minWidth: 0 }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 42,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <EscudoEquipo
                                                    equipo={partido.equipo_visitante}
                                                />
                                            </Box>

                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#07152F",
                                                    textAlign: "center",
                                                    fontSize: {
                                                        xs: "0.8rem",
                                                        sm: "0.95rem",
                                                    },
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {partido.equipo_visitante.nombre}
                                            </Typography>
                                        </Stack>
                                    </Box>

                                    {errorPartido && (
                                        <Typography
                                            variant="caption"
                                            color="error"
                                            sx={{
                                                display: "block",
                                                mt: 1.5,
                                            }}
                                        >
                                            {errorPartido}
                                        </Typography>
                                    )}
                                </Paper>
                            );
                        })}
                    </Stack>
                )}

                {partidos.length > 0 && (
                    <Stack
                        direction={{ xs: "column-reverse", sm: "row" }}
                        spacing={1.5}
                        justifyContent="flex-end"
                        sx={{ pt: 1 }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<CloseOutlinedIcon />}
                            onClick={() => navigate("/partidos")}
                            disabled={guardando}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderColor: "#E1E7F0",
                                color: "#53627A",
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<SaveOutlinedIcon />}
                            onClick={handleGuardar}
                            disabled={guardando}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                backgroundColor: "#123C82",
                                "&:hover": {
                                    backgroundColor: "#07152F",
                                },
                            }}
                        >
                            {guardando
                                ? "Guardando..."
                                : "Guardar resultados"}
                        </Button>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}