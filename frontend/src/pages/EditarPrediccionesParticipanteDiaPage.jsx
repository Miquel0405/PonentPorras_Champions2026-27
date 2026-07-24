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

import {
    getPartidos,
    getParticipante,
    guardarPrediccionesDia,
} from "../api/api";

import EscudoEquipo from "../components/partidos/EscudoEquipo";

function obtenerClaveDia(fecha) {
    const date = new Date(fecha);

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function EditarPrediccionesParticipanteDiaPage() {
    const { fecha, participanteId } = useParams();
    const navigate = useNavigate();

    const [participante, setParticipante] = useState(null);
    const [partidos, setPartidos] = useState([]);
    const [valores, setValores] = useState({});
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    const rutaParticipantes = `/partidos/dia/${fecha}/participantes`;

    useEffect(() => {
        let activo = true;

        async function cargarDatos() {
            setCargando(true);
            setError("");

            try {
                const [listaPartidos, datosParticipante] = await Promise.all([
                    getPartidos(),
                    getParticipante(participanteId),
                ]);

                if (!activo) return;

                const partidosDelDia = listaPartidos
                    .filter((partido) => obtenerClaveDia(partido.fecha) === fecha)
                    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

                const prediccionesPorPartido = new Map(
                    (datosParticipante.predicciones ?? []).map((prediccion) => [
                        prediccion.partido.id,
                        prediccion,
                    ])
                );

                const valoresIniciales = {};

                partidosDelDia.forEach((partido) => {
                    const prediccion = prediccionesPorPartido.get(partido.id);

                    valoresIniciales[partido.id] = {
                        goles_local: prediccion?.goles_local ?? null,
                        goles_visitante: prediccion?.goles_visitante ?? null,
                    };
                });

                setParticipante(datosParticipante);
                setPartidos(partidosDelDia);
                setValores(valoresIniciales);
            } catch (err) {
                console.error(err);

                if (activo) {
                    setError("No se han podido cargar los partidos o las predicciones.");
                }
            } finally {
                if (activo) setCargando(false);
            }
        }

        cargarDatos();

        return () => {
            activo = false;
        };
    }, [fecha, participanteId]);

    const handleChange = (partidoId, campo, texto) => {
        const valor = texto === "" ? null : Number(texto);

        setValores((actuales) => ({
            ...actuales,
            [partidoId]: {
                ...actuales[partidoId],
                [campo]: valor,
            },
        }));
    };

    const handleGuardar = async () => {
        setError("");

        for (const partido of partidos) {
            const prediccion = valores[partido.id];

            const local = prediccion?.goles_local ?? null;
            const visitante = prediccion?.goles_visitante ?? null;

            if ((local === null) !== (visitante === null)) {
                setError(
                    `Completa los dos goles o deja ambos vacíos para ${partido.equipo_local.nombre} - ${partido.equipo_visitante.nombre}.`
                );
                return;
            }

            for (const gol of [local, visitante]) {
                if (
                    gol !== null &&
                    (!Number.isInteger(gol) || gol < 0)
                ) {
                    setError("Los goles deben ser números enteros no negativos.");
                    return;
                }
            }
        }

        setGuardando(true);

        try {
            const predicciones = partidos.map((partido) => ({
                partido_id: partido.id,
                goles_local: valores[partido.id]?.goles_local ?? null,
                goles_visitante: valores[partido.id]?.goles_visitante ?? null,
            }));

            await guardarPrediccionesDia(
                participanteId,
                fecha,
                predicciones
            );

            navigate(rutaParticipantes);
        } catch (err) {
            console.error(err);

            const detalle =
                err.response?.data?.detail ??
                err.response?.data?.predicciones ??
                "No se han podido guardar las predicciones.";

            setError(
                typeof detalle === "string"
                    ? detalle
                    : "Revisa los datos introducidos e inténtalo de nuevo."
            );
        } finally {
            setGuardando(false);
        }
    };

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

    if (!participante) {
        return (
            <Box>
                <Alert severity="error">
                    {error || "No se ha encontrado el participante."}
                </Alert>

                <Button
                    onClick={() => navigate(rutaParticipantes)}
                    sx={{ mt: 2, textTransform: "none" }}
                >
                    Volver a participantes
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
                    mb: 1,
                }}
            >
                Editar predicciones
            </Typography>

            <Typography sx={{ color: "#53627A", mb: 3 }}>
                Participante:{" "}
                <Box
                    component="span"
                    sx={{ color: "#123C82", fontWeight: 800 }}
                >
                    {participante.nombre}
                </Box>
                <br />
                <Box component="span" sx={{ textTransform: "capitalize" }}>
                    {fechaFormateada}
                </Box>
            </Typography>

            {partidos.length === 0 ? (
                <Alert severity="warning">
                    No se han encontrado partidos para esta fecha.
                </Alert>
            ) : (
                <Stack spacing={1.5}>
                    {partidos.map((partido) => {
                        const prediccion = valores[partido.id] ?? {};

                        const hora = new Date(partido.fecha).toLocaleTimeString(
                            "es-ES",
                            {
                                hour: "2-digit",
                                minute: "2-digit",
                            }
                        );

                        return (
                            <Paper
                                key={partido.id}
                                elevation={0}
                                sx={{
                                    p: { xs: 1.5, sm: 2 },
                                    border: "1px solid #E1E7F0",
                                    borderRadius: "12px",
                                    backgroundColor: "#FFFFFF",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        color: "#53627A",
                                        textAlign: "center",
                                        mb: 1.5,
                                    }}
                                >
                                    {hora}
                                    {partido.fase ? ` · ${partido.fase}` : ""}
                                </Typography>

                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    spacing={{ xs: 0.75, sm: 2 }}
                                >
                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{ flex: 1, minWidth: 0 }}
                                    >
                                        <EscudoEquipo
                                            equipo={partido.equipo_local}
                                            size={36}
                                        />

                                        <Typography
                                            sx={{
                                                color: "#07152F",
                                                fontWeight: 700,
                                                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {partido.equipo_local.nombre}
                                        </Typography>
                                    </Stack>

                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={0.75}
                                        sx={{ flexShrink: 0 }}
                                    >
                                        <TextField
                                            type="number"
                                            size="small"
                                            value={prediccion.goles_local ?? ""}
                                            onChange={(event) =>
                                                handleChange(
                                                    partido.id,
                                                    "goles_local",
                                                    event.target.value
                                                )
                                            }
                                            inputProps={{
                                                min: 0,
                                                step: 1,
                                                inputMode: "numeric",
                                                "aria-label": `Goles predichos de ${partido.equipo_local.nombre}`,
                                            }}
                                            sx={{
                                                width: { xs: 54, sm: 68 },
                                                "& input": {
                                                    textAlign: "center",
                                                    p: 1,
                                                    fontWeight: 800,
                                                },
                                            }}
                                        />

                                        <Typography sx={{ fontWeight: 900, color: "#123C82" }}>
                                            –
                                        </Typography>

                                        <TextField
                                            type="number"
                                            size="small"
                                            value={prediccion.goles_visitante ?? ""}
                                            onChange={(event) =>
                                                handleChange(
                                                    partido.id,
                                                    "goles_visitante",
                                                    event.target.value
                                                )
                                            }
                                            inputProps={{
                                                min: 0,
                                                step: 1,
                                                inputMode: "numeric",
                                                "aria-label": `Goles predichos de ${partido.equipo_visitante.nombre}`,
                                            }}
                                            sx={{
                                                width: { xs: 54, sm: 68 },
                                                "& input": {
                                                    textAlign: "center",
                                                    p: 1,
                                                    fontWeight: 800,
                                                },
                                            }}
                                        />
                                    </Stack>

                                    <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "#07152F",
                                                fontWeight: 700,
                                                fontSize: { xs: "0.8rem", sm: "0.95rem" },
                                                textAlign: "right",
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {partido.equipo_visitante.nombre}
                                        </Typography>

                                        <EscudoEquipo
                                            equipo={partido.equipo_visitante}
                                            size={36}
                                        />
                                    </Stack>
                                </Stack>
                            </Paper>
                        );
                    })}
                </Stack>
            )}

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
                    onClick={() => navigate(rutaParticipantes)}
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
                    disabled={guardando || partidos.length === 0}
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

export default EditarPrediccionesParticipanteDiaPage;