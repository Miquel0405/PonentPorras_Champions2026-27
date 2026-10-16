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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    getParticipantes,
    getPartidos,
    getPronosticos,
    guardarPronosticosDia,
} from "../api/api";
import EscudoEquipo from "../components/partidos/EscudoEquipo";

function formatearFecha(fecha) {
    const [year, month, day] = fecha.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("cat-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function EditarPronosticosParticipanteDiaPage() {
    const { fecha, participanteId } = useParams();
    const navigate = useNavigate();

    const [participante, setParticipante] = useState(null);
    const [partidos, setPartidos] = useState([]);
    const [valores, setValores] = useState({});
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let activo = true;

        Promise.all([
            getParticipantes(),
            getPartidos({ fecha }),
            getPronosticos({ fecha, participante: participanteId }),
        ])
            .then(([participantes, datosPartidos, pronosticos]) => {
                if (!activo) return;

                const participanteActual = participantes.find(
                    (item) => String(item.id) === participanteId
                );
                if (!participanteActual) {
                    setError("No s'ha trobat el participant.");
                    return;
                }

                setParticipante(participanteActual);
                setPartidos(datosPartidos);

                const pronosticosPorPartido = new Map(
                    pronosticos.map((pronostico) => [
                        pronostico.partido.id,
                        pronostico,
                    ])
                );
                setValores(
                    Object.fromEntries(
                        datosPartidos.map((partido) => {
                            const pronostico = pronosticosPorPartido.get(
                                partido.id
                            );
                            return [
                                partido.id,
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
                    setError("No s'han pogut carregar les dades del dia.");
                }
            })
            .finally(() => {
                if (activo) setCargando(false);
            });

        return () => {
            activo = false;
        };
    }, [fecha, participanteId]);

    const handleChange = (partidoId, campo, valor) => {
        setValores((actual) => ({
            ...actual,
            [partidoId]: {
                ...actual[partidoId],
                [campo]: valor,
            },
        }));
    };

    const handleGuardar = async () => {
        setError(null);
        setGuardando(true);

        try {
            await guardarPronosticosDia(
                participanteId,
                fecha,
                partidos.map((partido) => ({
                    partido_id: partido.id,
                    goles_local: valores[partido.id]?.goles_local ?? null,
                    goles_visitante:
                        valores[partido.id]?.goles_visitante ?? null,
                }))
            );
            navigate(`/partidos/dia/${fecha}/participantes`);
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.detail ??
                    "No s'han pogut guardar les porres."
            );
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return (
            <Box sx={{ minHeight: 240, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress sx={{ color: "#3478F6" }} />
            </Box>
        );
    }

    if (error && !participante) {
        return (
            <Alert severity="error" role="alert">
                {error}
            </Alert>
        );
    }

    const campoGoles = (partidoId, campo, etiqueta) => (
        <TextField
            type="number"
            size="small"
            label={etiqueta}
            value={valores[partidoId]?.[campo] ?? ""}
            onChange={(event) => {
                const texto = event.target.value;
                handleChange(
                    partidoId,
                    campo,
                    texto === "" ? null : Number(texto)
                );
            }}
            inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
            sx={{
                width: { xs: 82, sm: 100 },
                "& input": { textAlign: "center", fontWeight: 800 },
            }}
        />
    );

    return (
        <Box>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3, position: "relative"}}
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
                        Porres de {participante.nombre}
                    </Typography>
                    <Typography sx={{ color: "#DCE6F5", mt: 0.5, textTransform: "capitalize" }}>
                        {formatearFecha(fecha)}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position : "absolute",
                        top: 0,
                        right: 0,
                    }}
                >
                    <Button
                        component={Link}
                        to={`/partidos/dia/${fecha}/participantes`}
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        disabled={guardando}
                        sx={{
                            backgroundColor: "#123C82",
                            borderColor: "#F3F6FC",
                            color: "#F3F6FC",
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 700,
                            "&:hover": {
                                backgroundColor: "#3478F6",
                            },
                        }}
                    >
                        Tornar als participants
                    </Button>
                </Box>
            </Stack>

            {error && (
                <Alert severity="error" role="alert" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Stack spacing={1.5} sx={{ width: "100%" }}>
                {partidos.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: "center", color: "#53627A" }}>
                        No hi ha partits en aquesta data.
                    </Paper>
                ) : (
                    partidos.map((partido) => (
                        <Paper
                            key={partido.id}
                            elevation={0}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                border: "1px solid #E1E7F0",
                                borderRadius: "12px",
                                boxShadow: "0 2px 10px rgb(7 21 47 / 5%)",
                                display: "block",
                                width: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            <Box
                                sx={{
                                    width: "100%",
                                    height: "100%", // Obliga al contenedor a usar todo el alto disponible
                                    display: { xs: "flex", sm: "grid" },
                                    flexDirection: "column",
                                    gridTemplateColumns: "1fr auto 1fr", 
                                    // Forzamos el centrado vertical estricto de las 3 columnas principales respecto al Paper
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    justifyItems: "center",   
                                    gap: { xs: 2, sm: 4 },
                                }}
                            >
                                {/* 1. Equipo Local */}
                                <Stack 
                                    direction="row" 
                                    // Asegura que el escudo y el texto compartan el mismo eje central vertical
                                    alignItems="center" 
                                    spacing={1.5}
                                    sx={{ 
                                        width: "100%",
                                        height: "100%", // Se estira verticalmente para calcular el centro real
                                        justifyContent: { xs: "center", sm: "flex-end" } 
                                    }}
                                >
                                    <Typography 
                                        sx={{ 
                                            color: "#07152F", 
                                            fontWeight: 700, 
                                            textAlign: { xs: "center", sm: "right" },
                                            // El display flex interno ayuda a eliminar desajustes de línea base en el texto
                                            display: "flex",
                                            alignItems: "center",
                                            m: 0 // Eliminamos posibles márgenes heredados
                                        }}
                                    >
                                        {partido.equipo_local.nombre}
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <EscudoEquipo equipo={partido.equipo_local} size={40} />
                                    </Box>
                                </Stack>

                                {/* 2. Marcador / Inputs de Goles */}
                                <Stack 
                                    direction="row" 
                                    alignItems="center" 
                                    justifyContent="center" 
                                    spacing={1}
                                    sx={{ minWidth: "120px", height: "100%" }}
                                >
                                    {campoGoles(partido.id, "goles_local", "Local")}
                                    <Typography sx={{ color: "#123C82", fontWeight: 900, px: 0.5, display: "flex", alignItems: "center" }}>
                                        –
                                    </Typography>
                                    {campoGoles(partido.id, "goles_visitante", "Visitant")}
                                </Stack>
                                
                                {/* 3. Equipo Visitante */}
                                <Stack 
                                    direction="row" 
                                    // Asegura que el escudo y el texto compartan el mismo eje central vertical
                                    alignItems="center" 
                                    spacing={1.5}
                                    sx={{ 
                                        width: "100%",
                                        height: "100%", // Se estira verticalmente para calcular el centro real
                                        justifyContent: { xs: "center", sm: "flex-start" } 
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", shrink: 0 }}>
                                        <EscudoEquipo equipo={partido.equipo_visitante} size={40} />
                                    </Box>
                                    <Typography 
                                        sx={{ 
                                            color: "#07152F", 
                                            fontWeight: 700, 
                                            textAlign: { xs: "center", sm: "left" },
                                            display: "flex",
                                            alignItems: "center",
                                            m: 0 // Eliminamos posibles márgenes heredados
                                        }}
                                    >
                                        {partido.equipo_visitante.nombre}
                                    </Typography>
                                </Stack> 
                            </Box>
                        </Paper>
                    ))
                )}
            </Stack>




            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3, mb: 4 }}>
                <Button
                    variant="contained"
                    onClick={handleGuardar}
                    disabled={guardando || partidos.length === 0}
                    startIcon={
                        guardando ? (
                            <CircularProgress size={18} color="inherit" />
                        ) : (
                            <SaveOutlinedIcon />
                        )
                    }
                    sx={{
                        backgroundColor: "#123C82",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": { backgroundColor: "#07152F" },
                    }}
                >
                    {guardando ? "Guardant..." : "Guardar canvis"}
                </Button>
            </Stack>
        </Box>
    );
}

export default EditarPronosticosParticipanteDiaPage;


// <Stack spacing={1} sx={{ flex: 1, width: "100%" }}>
//                                     <Stack direction="row" alignItems="center" spacing={1}>
                                        
//                                         <Typography sx={{ color: "#07152F", fontWeight: 700 }}>
//                                             {partido.equipo_local.nombre}
//                                         </Typography>
//                                         <EscudoEquipo equipo={partido.equipo_local} size={30} />
//                                         {campoGoles(partido.id, "goles_local", "Local")}
//                                         <Typography sx={{ color: "#123C82", fontWeight: 900 }}>
//                                             –
//                                         </Typography>
//                                         {campoGoles(partido.id, "goles_visitante", "Visitant")}
//                                         <EscudoEquipo equipo={partido.equipo_visitante} size={30} />
//                                         <Typography sx={{ color: "#07152F", fontWeight: 700 }}>
//                                             {partido.equipo_visitante.nombre}
//                                         </Typography>
//                                     </Stack>
//                                 </Stack>