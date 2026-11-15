import { Box, Paper, Typography } from "@mui/material";
import DistribResultadosParticipante from "../graficos/DistribResultadosParticipante";
import DistribPuntosParticipante from "../graficos/DistribPuntosParticipante";

function ParticipanteGraphs({ participante }) {
    const gruposGraficos = [
        {
            id: "distribucio-circular",
            title: "Distribució circular",
            charts: [
                <DistribResultadosParticipante
                    key="resultats"
                    participante={participante}
                />,
                <DistribPuntosParticipante
                    key="punts"
                    participante={participante}
                />,
            ],
        },
        // {
        //     id: "evolucio",
        //     title: "Evolució",
        //     chart: <EvoPuntosPorJornada pronosticos={pronosticos} />,
        // },
        // {
        //     id: "barres",
        //     title: "Gràfics de barres",
        //     chart: <PuntosPorPartido pronosticos={pronosticos} />,
        // },
    ];

    return (
        <Box sx={{ display: "grid", gap: 3 }}>
            {gruposGraficos.map((grupo) => (
                <Box component="section" key={grupo.id}>
                    <Typography
                        component="h2"
                        sx={{
                            mb: 1.5,
                            color: "#07152F",
                            fontSize: "1.1rem",
                            fontWeight: 800,
                        }}
                    >
                        {grupo.title}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "minmax(0, 1fr)",
                                md: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 2,
                        }}
                    >
                        {grupo.charts.map((chart) => (
                            <Paper
                                key={chart.key}
                                elevation={0}
                                sx={{
                                    minWidth: 0,
                                    p: { xs: 1.5, sm: 2 },
                                    border: "1px solid #E1E7F0",
                                    borderRadius: "10px",
                                }}
                            >
                                {chart}
                            </Paper>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default ParticipanteGraphs;
