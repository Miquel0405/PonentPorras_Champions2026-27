
import { useParams } from "react-router-dom";
import {
    Box,
    Grid,
    Paper,
    Typography,
} from "@mui/material";

import Podio from "../components/clasificacion/Podio";
import PartidosInicio from "../components/partidos/PartidosInicio";

function HomePage() {

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography
                    component="h1"
                    sx={{
                        mb: 0.75,
                        color: "#07152F",
                        fontSize: { xs: "1.6rem", md: "2rem" },
                        fontWeight: 800,
                        lineHeight: 1.2,
                    }}
                >
                    Inicio
                </Typography>

                <Typography
                    sx={{
                        color: "#53627A",
                        fontSize: "0.95rem",
                    }}
                >
                    Consulta la clasificación y sigue los próximos partidos.
                </Typography>
            </Box>

            <Grid container spacing={3} alignItems="stretch">
                {/* Podio de la porra */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            height: "100%",
                            minWidth: 0,
                            p: { xs: 2, md: 3 },
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E1E7F0",
                            borderRadius: "12px",
                            boxShadow: "0 2px 10px rgb(7 21 47 / 6%)",
                        }}
                    >
                        <Podio/>
                    </Paper>
                </Grid>

                {/* Próximos partidos */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            height: "100%",
                            minWidth: 0,
                            p: { xs: 2, md: 3 },
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E1E7F0",
                            borderRadius: "12px",
                            boxShadow: "0 2px 10px rgb(7 21 47 / 6%)",
                        }}
                    >
                        <PartidosInicio />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default HomePage;
