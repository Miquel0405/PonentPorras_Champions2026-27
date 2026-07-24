
import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import Clasificacion from "../components/clasificacion/Clasificacion";

function ClasificacionPage() {
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
                    Clasificación
                </Typography>

                <Typography
                    sx={{
                        color: "#53627A",
                        fontSize: "0.95rem",
                    }}
                >
                    Consulta los puntos y la posición de cada participante.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E1E7F0",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgb(7 21 47 / 6%)",
                }}
            >
                <Clasificacion />
            </Paper>
        </Box>
    );
}

export default ClasificacionPage;
