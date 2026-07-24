
import {
    Box,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PrediccionParticipanteCard from "../predicciones/PrediccionParticipanteCard";

function ParticipantePorras({ predicciones = [] }) {
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
                        fontSize: "1.2rem",
                        fontWeight: 800,
                    }}
                >
                    Predicciones
                </Typography>

                <Box
                    sx={{
                        ml: "auto",
                        px: 1.25,
                        py: 0.5,
                        borderRadius: "20px",
                        bgcolor: "#EAF1FF",
                        color: "#123C82",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                    }}
                >
                    {predicciones.length}
                </Box>
            </Stack>

            {predicciones.length === 0 ? (
                <Box
                    sx={{
                        py: 4,
                        px: 2,
                        textAlign: "center",
                        border: "1px dashed #D4DEEC",
                        borderRadius: "10px",
                        bgcolor: "#F8FAFE",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#07152F",
                            fontWeight: 700,
                            mb: 0.5,
                        }}
                    >
                        Todavía no hay predicciones
                    </Typography>

                    <Typography sx={{ color: "#53627A", fontSize: "0.9rem" }}>
                        Este participante aún no ha realizado ninguna predicción.
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={1.5}>
                    {predicciones.map((prediccion) => (
                        <PrediccionParticipanteCard
                            key={prediccion.id}
                            prediccion={prediccion}
                        />
                    ))}
                </Stack>
            )}
        </Paper>
    );
}

export default ParticipantePorras;
