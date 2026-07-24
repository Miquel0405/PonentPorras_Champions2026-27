
import { Box, Paper, Typography } from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";

function ParticipanteStats() {
    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: "#FFFFFF",
                border: "1px solid #E1E7F0",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgb(7 21 47 / 6%)",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <QueryStatsIcon sx={{ color: "#3478F6" }} />

                <Typography
                    component="h2"
                    sx={{
                        color: "#07152F",
                        fontSize: "1.2rem",
                        fontWeight: 800,
                    }}
                >
                    Estadísticas
                </Typography>
            </Box>

            <Typography sx={{ color: "#53627A", fontSize: "0.9rem" }}>
                Las estadísticas detalladas estarán disponibles cuando se
                incorporen los datos correspondientes.
            </Typography>
        </Paper>
    );
}

export default ParticipanteStats;
