
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useNavigate } from "react-router-dom";
import EscudoEquipo from "../partidos/EscudoEquipo";


function PrediccionParticipanteCard({ prediccion }) {
    const navigate = useNavigate();
    const partido = prediccion.partido;

    const fecha = new Date(partido.fecha).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const tieneResultado =
        partido.goles_local != null &&
        partido.goles_visitante != null;

    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid #E1E7F0",
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                overflow: "hidden",
                "&:hover": {
                    borderColor: "#3478F6",
                    boxShadow: "0 3px 12px rgb(7 21 47 / 6%)",
                },
            }}
        >
            <CardActionArea
                onClick={() => navigate(`/partidos/${partido.id}`)}
            >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {/* <Typography
                                sx={{
                                    color: "#07152F",
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {partido.equipo_local.nombre}
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#07152F",
                                    fontWeight: 700,
                                    fontSize: "0.9rem",
                                    mt: 0.5,
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {partido.equipo_visitante.nombre}
                            </Typography> */}

                            <Stack direction="row" alignItems="center" spacing={1}>
                                <EscudoEquipo equipo={partido.equipo_local} size={28} />
                                <Typography
                                    sx={{
                                        color: "#07152F",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {partido.equipo_local.nombre}
                                </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                                <EscudoEquipo equipo={partido.equipo_visitante} size={28} />
                                <Typography
                                    sx={{
                                        color: "#07152F",
                                        fontWeight: 700,
                                        fontSize: "0.9rem",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {partido.equipo_visitante.nombre}
                                </Typography>
                            </Stack>


                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    color: "#53627A",
                                    mt: 1,
                                    textTransform: "capitalize",
                                }}
                            >
                                {fecha}
                            </Typography>
                        </Box>

                        <Box sx={{ textAlign: "center", flexShrink: 0 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    color: "#53627A",
                                    mb: 0.5,
                                }}
                            >
                                Tu pronóstico
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#123C82",
                                    fontSize: "1.15rem",
                                    fontWeight: 900,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {prediccion.goles_local} -{" "}
                                {prediccion.goles_visitante}
                            </Typography>

                            {tieneResultado && (
                                <>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: "block",
                                            color: "#53627A",
                                            mt: 1,
                                        }}
                                    >
                                        Resultado real
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: "#07152F",
                                            fontWeight: 700,
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {partido.goles_local} -{" "}
                                        {partido.goles_visitante}
                                    </Typography>
                                </>
                            )}
                        </Box>

                        <Box
                            sx={{
                                minWidth: 55,
                                textAlign: "center",
                                flexShrink: 0,
                                pl: 1.5,
                                borderLeft: "1px solid #E1E7F0",
                            }}
                        >
                            <EmojiEventsIcon
                                sx={{ color: "#E8BD65", fontSize: 20 }}
                            />

                            <Typography
                                sx={{
                                    color: "#07152F",
                                    fontWeight: 900,
                                    fontSize: "1.1rem",
                                }}
                            >
                                {prediccion.puntos ?? 0}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{ color: "#53627A" }}
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

export default PrediccionParticipanteCard;
