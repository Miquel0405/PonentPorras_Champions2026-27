import { Box, Paper, Stack, Typography } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PrediccionPartidoCard from "../predicciones/PrediccionPartidoCard";

function PartidoPorras({
    predicciones = [],
    editable = false,
    participantes = [],
    valoresPredicciones = {},
    onPrediccionChange,
}) {
    const total = editable ? participantes.length : predicciones.length;

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                border: "1px solid #E1E7F0",
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 2px 10px rgb(7 21 47 / 5%)",
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2.5 }}
            >
                <SportsSoccerIcon sx={{ color: "#3478F6" }} />

                <Typography
                    component="h2"
                    sx={{
                        color: "#07152F",
                        fontSize: "1.15rem",
                        fontWeight: 800,
                    }}
                >
                    {editable ? "Editar pronósticos" : "Pronósticos de los participantes"}
                </Typography>

                <Box
                    sx={{
                        ml: "auto !important",
                        px: 1.25,
                        py: 0.4,
                        borderRadius: "20px",
                        backgroundColor: "#EAF1FF",
                        color: "#123C82",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                    }}
                >
                    {total}
                </Box>
            </Stack>

            {total === 0 ? (
                <Box
                    sx={{
                        py: 4,
                        textAlign: "center",
                        backgroundColor: "#F3F6FC",
                        borderRadius: "10px",
                    }}
                >
                    <Typography sx={{ color: "#53627A", fontWeight: 600 }}>
                        {editable
                            ? "No hay participantes registrados."
                            : "Todavía no hay pronósticos para este partido."}
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={1.25}>
                    {editable
                        ? participantes.map((participante) => {
                            const valores = valoresPredicciones[participante.id] ?? {
                                goles_local: null,
                                goles_visitante: null,
                            };

                            return (
                                <PrediccionPartidoCard
                                    key={participante.id}
                                    editable
                                    participante={participante}
                                    golesLocal={valores.goles_local}
                                    golesVisitante={valores.goles_visitante}
                                    onChange={(campo, valor) =>
                                        onPrediccionChange(
                                            participante.id,
                                            campo,
                                            valor
                                        )
                                    }
                                />
                            );
                        })
                        : predicciones.map((prediccion) => (
                            <PrediccionPartidoCard
                                key={prediccion.id}
                                prediccion={prediccion}
                            />
                        ))}
                </Stack>
            )}
        </Paper>
    );
}

export default PartidoPorras;