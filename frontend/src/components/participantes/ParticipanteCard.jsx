
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    Stack,
} from "@mui/material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";

const estilosPosicion = {
    1: {
        fondo: "#FFF7E5",
        borde: "#E8BD65",
        insignia: "#E8BD65",
        texto: "#07152F",
    },
    2: {
        fondo: "#F1F4F8",
        borde: "#B8C2CF",
        insignia: "#C5CDD7",
        texto: "#07152F",
    },
    3: {
        fondo: "#FBF0E8",
        borde: "#BC8056",
        insignia: "#BC8056",
        texto: "#FFFFFF",
    },
};

function ParticipanteCard({ participante, posicion }) {
    const navigate = useNavigate();
    const estilo = estilosPosicion[posicion];

    const irAParticipante = () => {
        navigate(`/participantes/${participante.participante}`);
    };

    return (
        <Card
            elevation={0}
            sx={{
                width: "100%",
                bgcolor: estilo?.fondo ?? "transparent",
                border: "1px solid",
                borderColor: estilo?.borde ?? "transparent",
                borderRadius: "10px",
                boxShadow: "none",
                overflow: "hidden",
            }}
        >
            <CardActionArea
                onClick={irAParticipante}
                aria-label={`Ver perfil de ${participante.nombre}`}
                sx={{
                    "&:hover": {
                        bgcolor: estilo?.fondo ?? "#F3F7FD",
                    },
                    "&:focus-visible": {
                        outline: "3px solid #3478F6",
                        outlineOffset: "-3px",
                    },
                }}
            >
                <CardContent sx={{ p: { xs: 1, sm: 1.5 }, "&:last-child": { pb: { xs: 1, sm: 1.5 } } }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ xs: 1, sm: 2 }}
                    >
                        <Box
                            sx={{
                                flexShrink: 0,
                                width: 42,
                                height: 42,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "10px",
                                bgcolor: estilo?.insignia ?? "#EAF1FF",
                                color: estilo?.texto ?? "#123C82",
                                fontWeight: 800,
                            }}
                        >
                            {posicion <= 3 ? (
                                <EmojiEventsIcon />
                            ) : (
                                <Typography
                                    component="span"
                                    sx={{ fontWeight: 800, color: "inherit" }}
                                >
                                    {posicion}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    color: "#07152F",
                                    fontWeight: 800,
                                    fontSize: "0.95rem",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {participante.nombre}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    color: "#53627A",
                                    fontSize: "0.78rem",
                                }}
                            >
                                {participante.predicciones ?? 0} predicciones
                            </Typography>
                        </Box>

                        <Box sx={{ flexShrink: 0, textAlign: "right" }}>
                            <Typography
                                sx={{
                                    color: "#123C82",
                                    fontWeight: 800,
                                    fontSize: { xs: "1rem", sm: "1.15rem" },
                                }}
                            >
                                {participante.puntos ?? 0}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#53627A",
                                    fontSize: "0.75rem",
                                }}
                            >
                                puntos
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default ParticipanteCard;
