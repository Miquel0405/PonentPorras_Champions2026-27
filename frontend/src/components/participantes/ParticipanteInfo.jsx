import { Box, Typography } from "@mui/material";

function ParticipanteInfo({ participante }) {
    const totalPorres = participante.pronosticos?.length ?? 0;
    const encertsSenseErrors = totalPorres - (participante.errores ?? 0);

    const informacionGeneral = [
        ["Porres registrades", totalPorres],
        [
            "Mitjana de punts per porra",
            totalPorres ? (participante.puntos / totalPorres).toFixed(2) : "0.00",
        ],
        [
            "Mitjana de punts per porra encertada (sense errors)",
            encertsSenseErrors
                ? (participante.puntos / encertsSenseErrors).toFixed(2)
                : "0.00",
        ],
        [
            "Projecció de punts totals al final de la competició (si es manté la mitjana actual a 189 partits)",
            totalPorres
                ? (participante.puntos / totalPorres * 189).toFixed(0)
                : "0.00",
        ],
    ];

    const estadistiques = [
        {
            label: "Plenos",
            total: participante.plenos ?? 0,
            color: "#16803C",
            background: "#F0FAF2",
            border: "#B7E2C1",
        },
        {
            label: "Diferència de gols (DDG)",
            total: participante.ddg ?? 0,
            color: "#987000",
            background: "#FFF9E6",
            border: "#F0D98A",
        },
        {
            label: "Encerts 1X2",
            total: participante.x1x2 ?? 0,
            color: "#C45B13",
            background: "#FFF4EB",
            border: "#F2C7A7",
        },
        {
            label: "Errors totals",
            total: participante.errores ?? 0,
            color: "#C62828",
            background: "#FFF1F1",
            border: "#F0B8B8",
        },
    ].map((estadistica) => ({
        ...estadistica,
        percentage: totalPorres
            ? `(${((estadistica.total / totalPorres) * 100).toFixed(2)}%)`
            : "(0.00%)",
    }));

    const fieldsetSx = {
        minWidth: 0,
        m: 0,
        p: { xs: 1.5, sm: 2 },
        border: "1px solid #D7DFEB",
        borderRadius: "10px",
    };

    const labelSx = {
        color: "#53627A",
        fontSize: "0.9rem",
        fontWeight: 600,
        overflowWrap: "anywhere",
    };

    return (
        <Box>
            <Typography
                component="h2"
                sx={{
                    mb: 2,
                    color: "#07152F",
                    fontSize: "1.2rem",
                    fontWeight: 800,
                }}
            >
                Informació del participant
            </Typography>

            <Box
                component="fieldset"
                sx={{
                    ...fieldsetSx,
                    mb: 2,
                }}
            >
                <Typography
                    component="legend"
                    sx={{ px: 1, color: "#07152F", fontWeight: 700 }}
                >
                    Resum
                </Typography>
                <Box>
                    {informacionGeneral.map(([label, value], index) => (
                        <Box
                            key={label}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "minmax(0, 1fr) auto",
                                },
                                alignItems: "center",
                                gap: 1,
                                py: 1.25,
                                borderBottom:
                                    index < informacionGeneral.length - 1
                                        ? "1px solid #E8EDF4"
                                        : "none",
                            }}
                        >
                            <Typography sx={labelSx}>{label}</Typography>
                            <Typography
                                sx={{
                                    color: "#123C82",
                                    fontSize: "1rem",
                                    fontWeight: 800,
                                    textAlign: { xs: "left", sm: "right" },
                                    overflowWrap: "anywhere",
                                }}
                            >
                                {value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box component="fieldset" sx={fieldsetSx}>
                <Typography
                    component="legend"
                    sx={{ px: 1, color: "#07152F", fontWeight: 700 }}
                >
                    Estadístiques d'encerts i errors
                </Typography>
                <Box sx={{ display: "grid", gap: 1 }}>
                    {estadistiques.map((estadistica) => (
                        <Box
                            key={estadistica.label}
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "minmax(0, 1fr) auto",
                                },
                                alignItems: "center",
                                gap: 1,
                                px: 1.5,
                                py: 1.25,
                                color: estadistica.color,
                                bgcolor: estadistica.background,
                                border: `1px solid ${estadistica.border}`,
                                borderRadius: "8px",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: "0.9rem",
                                    fontWeight: 700,
                                }}
                            >
                                {estadistica.label}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: 2,
                                }}
                            >
                                <Typography sx={{ fontWeight: 800 }}>
                                    {estadistica.total}
                                </Typography>
                                <Typography
                                    sx={{
                                        minWidth: "5.5rem",
                                        fontSize: "0.9rem",
                                        fontWeight: 700,
                                        textAlign: "right",
                                    }}
                                >
                                    {estadistica.percentage}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default ParticipanteInfo;
