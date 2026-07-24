import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

function PrediccionPartidoCard({
    prediccion,
    editable = false,
    participante: participanteEdicion,
    golesLocal,
    golesVisitante,
    onChange,
}) {
    const participante = participanteEdicion ?? prediccion?.participante;

    const campoGoles = (valor, campo) => (
        <TextField
            type="number"
            size="small"
            value={valor ?? ""}
            onChange={(event) => {
                const texto = event.target.value;
                onChange(campo, texto === "" ? null : Number(texto));
            }}
            inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
            sx={{
                width: 68,
                "& input": {
                    textAlign: "center",
                    p: 1,
                    fontWeight: 800,
                },
            }}
        />
    );

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: "1px solid #E1E7F0",
                borderRadius: "12px",
                backgroundColor: "#FFFFFF",
                transition: "border-color 0.2s ease",
                "&:hover": { borderColor: "#3478F6" },
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                spacing={{ xs: 1, sm: 2 }}
            >
                <Box
                    sx={{
                        width: 42,
                        height: 42,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor: "#EAF1FF",
                        color: "#123C82",
                        fontWeight: 800,
                    }}
                >
                    {participante?.nombre?.charAt(0)?.toUpperCase() ?? "?"}
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                        sx={{
                            color: "#07152F",
                            fontWeight: 700,
                            overflowWrap: "anywhere",
                        }}
                    >
                        {participante?.nombre}
                    </Typography>

                    <Typography variant="caption" sx={{ color: "#53627A" }}>
                        {editable ? "Editar pronóstico" : "Pronóstico"}
                    </Typography>
                </Box>

                {editable ? (
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={{ xs: 0.5, sm: 1 }}
                    >
                        {campoGoles(golesLocal, "goles_local")}

                        <Typography sx={{ color: "#123C82", fontWeight: 900 }}>
                            –
                        </Typography>

                        {campoGoles(golesVisitante, "goles_visitante")}
                    </Stack>
                ) : (
                    <>
                        <Box sx={{ textAlign: "center", flexShrink: 0 }}>
                            <Typography
                                sx={{
                                    color: "#123C82",
                                    fontSize: "1.25rem",
                                    fontWeight: 900,
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                                {prediccion.goles_local} - {prediccion.goles_visitante}
                            </Typography>
                        </Box>

                        <Box sx={{ minWidth: 70, textAlign: "right", flexShrink: 0 }}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-end"
                                spacing={0.5}
                            >
                                <EmojiEventsIcon sx={{ fontSize: 17, color: "#E8BD65" }} />

                                <Typography
                                    sx={{
                                        color: "#07152F",
                                        fontWeight: 800,
                                        fontVariantNumeric: "tabular-nums",
                                    }}
                                >
                                    {prediccion.puntos ?? 0}
                                </Typography>
                            </Stack>

                            <Typography variant="caption" sx={{ color: "#53627A" }}>
                                puntos
                            </Typography>
                        </Box>
                    </>
                )}
            </Stack>
        </Paper>
    );
}

export default PrediccionPartidoCard;