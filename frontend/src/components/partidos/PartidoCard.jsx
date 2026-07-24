
import {
    Card,
    CardActionArea,
    CardContent,
    Box,
    Stack,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import EscudoEquipo from "./EscudoEquipo";

function PartidoCard({ partido }) {
    const navigate = useNavigate();

    const fechaPartido = new Date(partido.fecha);

    const fecha = fechaPartido.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
    });

    const hora = fechaPartido.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
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
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
                transition: "all 0.2s ease",
                "&:hover": {
                    borderColor: "#3478F6",
                    boxShadow: "0 4px 14px rgb(7 21 47 / 8%)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardActionArea
                onClick={() => navigate(`/partidos/${partido.id}`)}
                sx={{ height: "100%" }}
            >
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                    >
                        <Box
                            sx={{
                                minWidth: 58,
                                textAlign: "center",
                                borderRight: "1px solid #E1E7F0",
                                pr: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#123C82",
                                    fontWeight: 800,
                                    fontSize: "0.9rem",
                                    textTransform: "capitalize",
                                }}
                            >
                                {fecha}
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{ color: "#53627A" }}
                            >
                                {hora}
                            </Typography>
                        </Box>

                        <Stack
                            spacing={1}
                            sx={{ flex: 1, minWidth: 0 }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <EscudoEquipo equipo={partido.equipo_local} size={30} />
                                <Typography
                                    sx={{
                                        color: "#07152F",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {partido.equipo_local.nombre}
                                </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
                                <EscudoEquipo equipo={partido.equipo_visitante} size={30} />
                                <Typography
                                    sx={{
                                        color: "#07152F",
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {partido.equipo_visitante.nombre}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Box
                            sx={{
                                minWidth: 52,
                                textAlign: "center",
                                flexShrink: 0,
                            }}
                        >
                            {tieneResultado ? (
                                <Typography
                                    sx={{
                                        color: "#07152F",
                                        fontSize: "1.2rem",
                                        fontWeight: 800,
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {partido.goles_local} -{" "}
                                    {partido.goles_visitante}
                                </Typography>
                            ) : (
                                <Typography
                                    sx={{
                                        color: "#53627A",
                                        fontSize: "0.8rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    VS
                                </Typography>
                            )}

                            <Typography
                                variant="caption"
                                sx={{
                                    display: "block",
                                    color: tieneResultado
                                        ? "#16A36A"
                                        : "#53627A",
                                    mt: 0.25,
                                }}
                            >
                                {tieneResultado ? "Finalizado" : "Pendiente"}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default PartidoCard;
