
import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function ParticipanteBanner({ participante }) {
    const nombre = participante.nombre || "Participante";
    const inicial = nombre.trim().charAt(0).toUpperCase() || "?";

    return (
        <Paper
            elevation={0}
            sx={{
                position: "relative",
                overflow: "hidden",
                mb: 3,
                p: { xs: 3, md: 4 },
                color: "#FFFFFF",
                background: "linear-gradient(120deg, #07152F 0%, #123C82 100%)",
                border: "1px solid #1C3765",
                borderBottom: "3px solid #E8BD65",
                borderRadius: "16px",
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: 180,
                    height: 180,
                    right: -55,
                    top: -75,
                    borderRadius: "50%",
                    border: "1px solid rgb(255 255 255 / 10%)",
                    pointerEvents: "none",
                }}
            />

            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={3}
                sx={{ position: "relative" }}
            >
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                        sx={{
                            width: { xs: 56, md: 68 },
                            height: { xs: 56, md: 68 },
                            bgcolor: "#E8BD65",
                            color: "#07152F",
                            fontSize: "1.6rem",
                            fontWeight: 800,
                        }}
                    >
                        {inicial}
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                mb: 0.5,
                                color: "#C7D5F0",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                            }}
                        >
                            Perfil del participant
                        </Typography>

                        <Typography
                            component="h1"
                            sx={{
                                color: "#FFFFFF",
                                fontSize: { xs: "1.6rem", md: "2rem" },
                                fontWeight: 800,
                                lineHeight: 1.2,
                                overflowWrap: "anywhere",
                            }}
                        >
                            {nombre}
                        </Typography>
                    </Box>
                </Stack>

                <Box
                    sx={{
                        minWidth: 150,
                        p: 2,
                        borderRadius: "12px",
                        bgcolor: "rgb(255 255 255 / 8%)",
                        border: "1px solid rgb(255 255 255 / 12%)",
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <EmojiEventsIcon sx={{ color: "#E8BD65" }} />
                        <Typography
                            sx={{
                                color: "#C7D5F0",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                            }}
                        >
                            Punts totals
                        </Typography>
                    </Stack>

                    <Typography
                        sx={{
                            mt: 0.5,
                            color: "#FFFFFF",
                            fontSize: "2rem",
                            fontWeight: 800,
                            lineHeight: 1.2,
                        }}
                    >
                        {participante.puntos ?? 0}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
}

export default ParticipanteBanner;
