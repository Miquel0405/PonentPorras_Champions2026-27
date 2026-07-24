import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import EscudoEquipo from "./EscudoEquipo";

function PartidoBanner({
    partido,
    editable = false,
    golesLocal,
    golesVisitante,
    onResultadoChange,
}) {
    const tieneResultado =
        partido.goles_local != null &&
        partido.goles_visitante != null;

    const fecha = new Date(partido.fecha);

    const fechaFormateada = fecha.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const hora = fecha.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const campoGoles = (valor, campo) => (
        <TextField
            type="number"
            size="small"
            value={valor ?? ""}
            onChange={(event) => {
                const texto = event.target.value;
                onResultadoChange(campo, texto === "" ? null : Number(texto));
            }}
            inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
            sx={{
                width: { xs: 65, sm: 82 },
                "& .MuiOutlinedInput-root": {
                    color: "#FFFFFF",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                    fontWeight: 900,
                    backgroundColor: "rgba(255,255,255,0.08)",
                    "& fieldset": {
                        borderColor: "rgba(255,255,255,0.4)",
                    },
                    "&:hover fieldset": {
                        borderColor: "#E8BD65",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#E8BD65",
                    },
                },
                "& input": {
                    textAlign: "center",
                    p: { xs: 1, sm: 1.5 },
                },
                "& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                },
                "& input[type=number]": {
                    MozAppearance: "textfield",
                },
            }}
        />
    );

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                p: { xs: 2.5, sm: 4 },
                color: "#FFFFFF",
                background: "linear-gradient(125deg, #07152F 0%, #123C82 100%)",
                borderRadius: "16px",
                borderBottom: "4px solid #E8BD65",
                overflow: "hidden",
            }}
        >
            <Typography
                sx={{
                    color: "#E8BD65",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    textAlign: "center",
                    mb: 3,
                }}
            >
                Champions League · 2026–2027
            </Typography>

            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
            >
                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 1.5,
                    }}
                >
                    <EscudoEquipo equipo={partido.equipo_local} size={128} />

                    <Typography
                        sx={{
                            fontSize: { xs: "0.95rem", sm: "1.25rem" },
                            fontWeight: 800,
                            overflowWrap: "anywhere",
                            width: "100%",
                        }}
                    >
                        {partido.equipo_local.nombre}
                    </Typography>
                </Box>

                <Box sx={{ px: { xs: 0.5, sm: 1 }, textAlign: "center", flexShrink: 0 }}>
                    {editable ? (
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={{ xs: 0.5, sm: 1 }}
                        >
                            {campoGoles(golesLocal, "goles_local")}

                            <Typography sx={{ fontSize: "1.5rem", fontWeight: 900 }}>
                                –
                            </Typography>

                            {campoGoles(golesVisitante, "goles_visitante")}
                        </Stack>
                    ) : (
                        <>
                            {tieneResultado && (
                                <Typography
                                    sx={{
                                        fontSize: { xs: "1.8rem", sm: "2.5rem" },
                                        fontWeight: 900,
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {partido.goles_local} - {partido.goles_visitante}
                                </Typography>
                            )}

                            <Typography
                                sx={{
                                    fontSize: "1.4rem",
                                    fontWeight: 800,
                                    color: "#E8BD65",
                                }}
                            >
                                VS
                            </Typography>
                        </>
                    )}
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 1.5,
                    }}
                >
                    <EscudoEquipo equipo={partido.equipo_visitante} size={128} />

                    <Typography
                        sx={{
                            fontSize: { xs: "0.95rem", sm: "1.25rem" },
                            fontWeight: 800,
                            overflowWrap: "anywhere",
                            width: "100%",
                        }}
                    >
                        {partido.equipo_visitante.nombre}
                    </Typography>
                </Box>
            </Stack>

            {editable && (
                <Typography
                    sx={{
                        mt: 2,
                        textAlign: "center",
                        color: "#DCE6F5",
                        fontSize: "0.8rem",
                    }}
                >
                    Introduce el resultado real del partido
                </Typography>
            )}

            <Typography
                sx={{
                    mt: 3,
                    textAlign: "center",
                    color: "#DCE6F5",
                    fontSize: "0.85rem",
                    textTransform: "capitalize",
                }}
            >
                {fechaFormateada} · {hora}
            </Typography>

            <Typography
                sx={{
                    mt: 1,
                    textAlign: "center",
                    color: editable ? "#E8BD65" : tieneResultado ? "#8DE0B7" : "#DCE6F5",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                }}
            >
                {editable
                    ? "EDICIÓN DEL RESULTADO"
                    : tieneResultado
                        ? "PARTIDO FINALIZADO"
                        : "PARTIDO PENDIENTE"}
            </Typography>
        </Paper>
    );
}

export default PartidoBanner;