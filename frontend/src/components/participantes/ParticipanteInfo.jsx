import { Box, Typography } from "@mui/material";
import EscudoEquipo from "../partidos/EscudoEquipo";

function ParticipanteInfo({ participante }) {
    const totalPorres = participante.pronosticos?.length ?? 0;
    const encertsSenseErrors = totalPorres - (participante.errores ?? 0);
    const puntosPorEquipo = new Map();

    (participante.pronosticos ?? []).forEach((pronostico) => {
        const puntos = Number(pronostico.puntos ?? 0);
        const partido = pronostico.partido;

        const equiposDelPartido = new Map(
            [partido?.equipo_local, partido?.equipo_visitante]
                .filter((equipo) => equipo && equipo.id != null)
                .map((equipo) => [equipo.id, equipo])
        );

        equiposDelPartido.forEach((equipo) => {
            if (!puntosPorEquipo.has(equipo.id)) {
                puntosPorEquipo.set(equipo.id, {
                    equipo,
                    puntos: 0,
                    pronosticos: 0,
                    plenos: 0,
                    ddg: 0,
                    x1x2: 0,
                    errores: 0,
                });
            }

            const estadisticasEquipo = puntosPorEquipo.get(equipo.id);
            estadisticasEquipo.puntos += Number.isFinite(puntos) ? puntos : 0;
            estadisticasEquipo.pronosticos += 1;

            switch (Number(pronostico.estado)) {
                case 3:
                    estadisticasEquipo.plenos += 1;
                    break;
                case 2:
                    estadisticasEquipo.ddg += 1;
                    break;
                case 1:
                    estadisticasEquipo.x1x2 += 1;
                    break;
                case 0:
                    estadisticasEquipo.errores += 1;
                    break;
                default:
                    break;
            }
        });
    });

    const equiposOrdenados = [...puntosPorEquipo.values()].sort(
        (a, b) =>
            b.puntos - a.puntos ||
            a.pronosticos - b.pronosticos ||
            b.plenos - a.plenos ||
            b.ddg - a.ddg ||
            b.x1x2 - a.x1x2 ||
            a.equipo.nombre.localeCompare(b.equipo.nombre, "es")
    );
    const equiposDestacados = [
        {
            label: "Equip estrella (més punts)",
            equipos: equiposOrdenados.slice(0, 1),
            color: "var(--color-text-best)",
            background: "var(--color-back-best)",
            border: "var(--color-border-best)",
        },
        {
            label: "Equip fraude (menys punts)",
            equipos:
                equiposOrdenados.length > 0
                    ? [equiposOrdenados[equiposOrdenados.length - 1]]
                    : [],
            color: "var(--color-text-worst)",
            background: "var(--color-back-worst)",
            border: "var(--color-border-worst)",
        },
    ];

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
            color: "var(--color-text-pleno)",
            background: "var(--color-back-pleno)",
            border: "var(--color-border-pleno)",
        },
        {
            label: "Diferència de gols (DDG)",
            total: participante.ddg ?? 0,
            color: "var(--color-text-ddg)",
            background: "var(--color-back-ddg)",
            border: "var(--color-border-ddg)",
        },
        {
            label: "Encerts 1X2",
            total: participante.x1x2 ?? 0,
            color: "var(--color-text-1x2)",
            background: "var(--color-back-1x2)",
            border: "var(--color-border-1x2)",
        },
        {
            label: "Errors totals",
            total: participante.errores ?? 0,
            color: "var(--color-text-error)",
            background: "var(--color-back-error)",
            border: "var(--color-border-error)",
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

            <Box component="fieldset" sx={{ ...fieldsetSx, mt: 2 }}>
                <Typography
                    component="legend"
                    sx={{ px: 1, color: "#07152F", fontWeight: 700 }}
                >
                    Millors/Pitjors equips
                </Typography>
                {equiposOrdenados.length === 0 ? (
                    <Typography sx={labelSx}>
                        Encara no hi ha dades per equip.
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 1.5,
                        }}
                    >
                        {equiposDestacados.map((destacado) => (
                            <Box
                                key={destacado.label}
                                sx={{
                                    px: 1.5,
                                    py: 1.25,
                                    bgcolor: destacado.background,
                                    border: `1px solid ${destacado.border}`,
                                    borderRadius: "8px",
                                }}
                            >
                                <Typography
                                    sx={{
                                        mb: 1,
                                        color: destacado.color,
                                        fontSize: "0.9rem",
                                        fontWeight: 800,
                                    }}
                                >
                                    {destacado.label}
                                </Typography>
                                <Box sx={{ display: "grid", gap: 1 }}>
                                    {destacado.equipos.map(({ equipo, puntos }) => (
                                        <Box
                                            key={equipo.id}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 1,
                                                    minWidth: 0,
                                                }}
                                            >
                                                <EscudoEquipo equipo={equipo} size={32} />
                                                <Typography
                                                    sx={{
                                                        color: "#07152F",
                                                        fontWeight: 700,
                                                        overflowWrap: "anywhere",
                                                    }}
                                                >
                                                    {equipo.nombre}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                sx={{
                                                    color: destacado.color,
                                                    fontWeight: 900,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {puntos} punts
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default ParticipanteInfo;
