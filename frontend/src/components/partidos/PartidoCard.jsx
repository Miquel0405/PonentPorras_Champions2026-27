
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

    const fecha = fechaPartido.toLocaleDateString("cat-ES", {
        day: "numeric",
        month: "short",
    });

    const hora = fechaPartido.toLocaleTimeString("cat-ES", {
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
                <CardContent
                    sx={{
                        p: { xs: 1.5, sm: 2 },
                        "&:last-child": { pb: { xs: 1.5, sm: 2 } },
                    }}
                >
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        alignItems={{ xs: "stretch", md: "center" }}
                        spacing={{ xs: 1.5, md: 2 }}
                    >
                        <Stack
                            direction={{ xs: "row", md: "column" }}
                            alignItems="center"
                            justifyContent={{ xs: "space-between", md: "center" }}
                            spacing={{ xs: 1, md: 0 }}
                            sx={{
                                minWidth: { xs: 0, md: 58 },
                                flexShrink: 0,
                                borderRight: { xs: 0, md: "1px solid #E1E7F0" },
                                borderBottom: { xs: "1px solid #E1E7F0", md: 0 },
                                pr: { xs: 0, md: 2 },
                                pb: { xs: 1, md: 0 },
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
                        </Stack>

                        <Stack
                            spacing={1}
                            sx={{ flex: 1, minWidth: 0 }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ minWidth: 0 }}
                            >
                                <EscudoEquipo equipo={partido.equipo_local} size={30} />
                                <Typography
                                    sx={{
                                        minWidth: 0,
                                        flex: 1,
                                        color: "#07152F",
                                        fontWeight: 700,
                                        fontSize: {
                                            xs: "clamp(0.7rem, 3.6vw, 0.95rem)",
                                            md: "0.95rem",
                                        },
                                        lineHeight: 1.35,
                                        whiteSpace: "nowrap",
                                        overflowX: "auto",
                                        scrollbarWidth: "thin",
                                    }}
                                >
                                    {partido.equipo_local.nombre}
                                </Typography>
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ minWidth: 0 }}
                            >
                                <EscudoEquipo equipo={partido.equipo_visitante} size={30} />
                                <Typography
                                    sx={{
                                        minWidth: 0,
                                        flex: 1,
                                        color: "#07152F",
                                        fontWeight: 700,
                                        fontSize: {
                                            xs: "clamp(0.7rem, 3.6vw, 0.95rem)",
                                            md: "0.95rem",
                                        },
                                        lineHeight: 1.35,
                                        whiteSpace: "nowrap",
                                        overflowX: "auto",
                                        scrollbarWidth: "thin",
                                    }}
                                >
                                    {partido.equipo_visitante.nombre}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Box
                            sx={{
                                minWidth: 52,
                                textAlign: { xs: "left", md: "center" },
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
                                {tieneResultado ? "Finalitzat" : "Pendent"}
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default PartidoCard;
