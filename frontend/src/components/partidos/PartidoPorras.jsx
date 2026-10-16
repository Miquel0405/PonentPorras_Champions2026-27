import { Box, Paper, Stack, Typography } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PronosticoPartidoCard from "../pronosticos/PronosticoPartidoCard";

function PartidoPorras({
    pronosticos = [],
    editable = false,
    participantes = [],
    valoresPronosticos = {},
    onPronosticoChange,
}) {
    const total = editable ? participantes.length : pronosticos.length;

    const pronosticosOrdenados = [...pronosticos].sort((a, b) => {
        const puntosA = Number(a.puntos ?? 0);
        const puntosB = Number(b.puntos ?? 0);
        return puntosB - puntosA;
    });
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
                    {editable ? "Editar pronostics" : "Porres dels participants"}
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
                            ? "No hi ha participants registrats."
                            : "Encara no hi ha cap porra per aquest partit."}
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={1.25}>
                    {editable
                        ? participantes.map((participante) => {
                            const valores = valoresPronosticos[participante.id] ?? {
                                goles_local: null,
                                goles_visitante: null,
                            };

                            return (
                                <PronosticoPartidoCard
                                    key={participante.id}
                                    editable
                                    participante={participante}
                                    golesLocal={valores.goles_local}
                                    golesVisitante={valores.goles_visitante}
                                    onChange={(campo, valor) =>
                                        onPronosticoChange(
                                            participante.id,
                                            campo,
                                            valor
                                        )
                                    }
                                />
                            );
                        })
                        : pronosticosOrdenados.map((pronostico) => (
                            <PronosticoPartidoCard
                                key={pronostico.id}
                                pronostico={pronostico}
                            />
                        ))}
                </Stack>
            )}
        </Paper>
    );
}

export default PartidoPorras;