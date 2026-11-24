
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


function PronosticoParticipanteCard({ pronostico }) {
    const navigate = useNavigate();
    const partido = pronostico.partido;

    const fecha = new Date(partido.fecha).toLocaleDateString("cat-ES", {
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
                        direction={{ xs: "column", md: "row" }}
                        alignItems={{ xs: "stretch", md: "center" }}
                        spacing={{ xs: 1.5, md: 2 }}
                    >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            {[partido.equipo_local, partido.equipo_visitante].map(
                                (equipo, index) => (
                                    <Stack
                                        key={equipo.id ?? index}
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{ minWidth: 0, mt: index ? 0.5 : 0 }}
                                    >
                                        <EscudoEquipo equipo={equipo} size={28} />
                                        <Typography
                                            sx={{
                                                minWidth: 0,
                                                flex: 1,
                                                color: "#07152F",
                                                fontWeight: 700,
                                                fontSize: {
                                                    xs: "clamp(0.7rem, 3.6vw, 0.9rem)",
                                                    md: "0.9rem",
                                                },
                                                lineHeight: 1.35,
                                                whiteSpace: "nowrap",
                                                overflowX: "auto",
                                                scrollbarWidth: "thin",
                                            }}
                                        >
                                            {equipo.nombre}
                                        </Typography>
                                    </Stack>
                                )
                            )}


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
                                La teva porra
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#123C82",
                                    fontSize: "1.15rem",
                                    fontWeight: 900,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {pronostico.goles_local} -{" "}
                                {pronostico.goles_visitante}
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
                                        Resultat real
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
                                textAlign: { xs: "left", md: "center" },
                                flexShrink: 0,
                                pl: { xs: 0, md: 1.5 },
                                pt: { xs: 1, md: 0 },
                                borderLeft: { xs: 0, md: "1px solid #E1E7F0" },
                                borderTop: { xs: "1px solid #E1E7F0", md: 0 },
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
                                {pronostico.puntos ?? 0}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{ color: "#53627A" }}
                            >
                                punts
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default PronosticoParticipanteCard;
