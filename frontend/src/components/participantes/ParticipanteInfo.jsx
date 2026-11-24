import { Box, Typography } from "@mui/material";
import EscudoEquipo from "../partidos/EscudoEquipo";

function formatearDia(clave) {
    if (!clave) {
        return "";
    }

    const [year, month, day] = clave.split("-").map(Number);
    const fecha = new Date(year, month - 1, day);
    const diaSemana = fecha.toLocaleDateString("ca-ES", { weekday: "long" });
    const mes = fecha.toLocaleDateString("ca-ES", { month: "long" });
    const diaSemanaCapitalizado =
        diaSemana.charAt(0).toLocaleUpperCase("ca-ES") + diaSemana.slice(1);

    return `${diaSemanaCapitalizado} ${day} de ${mes} de ${year}`;
}

const estilosPalmares = {
    1: {
        background: "#FFF7E5",
        border: "#E8BD65",
        color: "#9A6B00",
    },
    2: {
        background: "#F1F4F8",
        border: "#B8C2CF",
        color: "#53627A",
    },
    3: {
        background: "#FBF0E8",
        border: "#BC8056",
        color: "#89552F",
    },
};

function ParticipanteInfo({ participante }) {
    const palmares = participante.palmares ?? [];
    const totalPorres = participante.pronosticos?.length ?? 0;
    const encertsSenseErrors = totalPorres - (participante.errores ?? 0);
    const puntosPorEquipo = new Map();
    const puntosPorJornada = new Map();
    const puntosPorDia = new Map();

    (participante.pronosticos ?? []).forEach((pronostico) => {
        const puntos = Number(pronostico.puntos ?? 0);
        const partido = pronostico.partido;
        const fecha = typeof partido?.fecha === "string"
            ? partido.fecha
            : "";
        const coincidenciaDia = fecha.match(/^(\d{4})-(\d{2})-(\d{2})/);
        const dia = coincidenciaDia
            ? `${coincidenciaDia[1]}-${coincidenciaDia[2]}-${coincidenciaDia[3]}`
            : null;

        const equiposDelPartido = new Map(
            [partido?.equipo_local, partido?.equipo_visitante]
                .filter((equipo) => equipo && equipo.id != null)
                .map((equipo) => [equipo.id, equipo])
        );

        const jornada = partido?.fase?.trim() || "Sin fase";
        if (!puntosPorJornada.has(jornada)) {
            puntosPorJornada.set(jornada, {
                jornada,
                puntos: 0,
                pronosticos: 0,
            });
        }
        const estadisticasJornada = puntosPorJornada.get(jornada);
        estadisticasJornada.puntos += Number.isFinite(puntos) ? puntos : 0;
        estadisticasJornada.pronosticos += 1;

        if (dia) {
            if (!puntosPorDia.has(dia)) {
                puntosPorDia.set(dia, {
                    dia,
                    fases: [],
                    puntos: 0,
                    pronosticos: 0,
                });
            }

            const estadisticasDia = puntosPorDia.get(dia);
            const fase = partido.fase?.trim() || "Sin fase";
            if (!estadisticasDia.fases.includes(fase)) {
                estadisticasDia.fases.push(fase);
            }
            estadisticasDia.puntos += Number.isFinite(puntos) ? puntos : 0;
            estadisticasDia.pronosticos += 1;
        }

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

    const diasOrdenados = [...puntosPorDia.values()].sort(
        (a, b) =>
            b.puntos - a.puntos ||
            (b.puntos / b.pronosticos) - (a.puntos / a.pronosticos) ||
            b.pronosticos - a.pronosticos ||
            b.dia.localeCompare(a.dia)
    );

    const jornadasOrdenadas = [...puntosPorJornada.values()].sort(
        (a, b) =>
            b.puntos - a.puntos ||
            (b.puntos / b.pronosticos) - (a.puntos / a.pronosticos) ||
            b.pronosticos - a.pronosticos ||
            a.jornada.localeCompare(b.jornada, "es")
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

    const diasDestacados = [
        {
            label: "Nit de glòria (més punts)",
            dia: diasOrdenados[0],
            color: "var(--color-text-best)",
            background: "var(--color-back-best)",
            border: "var(--color-border-best)",
        },
        {
            label: "Nit de malson (menys punts)",
            dia:
                diasOrdenados.length > 0
                    ? diasOrdenados[diasOrdenados.length - 1]
                    : null,
            color: "var(--color-text-worst)",
            background: "var(--color-back-worst)",
            border: "var(--color-border-worst)",
        },
    ];

    const jornadasDestacadas = [
        {
            label: "Millor jornada (més punts)",
            jornada: jornadasOrdenadas[0],
            color: "var(--color-text-best)",
            background: "var(--color-back-best)",
            border: "var(--color-border-best)",
        },
        {
            label: "Pitjor jornada (menys punts)",
            jornada:
                jornadasOrdenadas.length > 0
                    ? jornadasOrdenadas[jornadasOrdenadas.length - 1]
                    : null,
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
                    Millors i pitjors
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        alignItems: "start",
                        gap: 1.5,
                    }}
                >
            <Box component="fieldset" sx={fieldsetSx}>
                <Typography
                    component="legend"
                    sx={{ px: 1, color: "#07152F", fontWeight: 700 }}
                >
                    Equips
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
                                xs: "minmax(0, 1fr)",
                                sm: "repeat(2, minmax(0, 1fr))",
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
                                    {destacado.equipos.map(({ equipo, puntos, pronosticos }) => (
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
                                                    flex: 1,
                                                }}
                                            >
                                                <EscudoEquipo equipo={equipo} size={32} />
                                                <Typography
                                                    sx={{
                                                        color: "#07152F",
                                                        fontWeight: 700,
                                                        minWidth: 0,
                                                        overflowWrap: "anywhere",
                                                    }}
                                                >
                                                    {equipo.nombre}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                                                <Typography
                                                    sx={{
                                                        color: destacado.color,
                                                        fontWeight: 900,
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {puntos} punts
                                                </Typography>
                                                <Typography
                                                    sx={{ fontSize: "0.75rem", lineHeight: 1.2, color: destacado.color,}}
                                                >
                                                    {pronosticos} {pronosticos === 1 ? "partit" : "partits"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
            <Box component="fieldset" sx={fieldsetSx}>
                <Typography
                    component="legend"
                    sx={{ px: 1, color: "#07152F", fontWeight: 700 }}
                >
                    Jornades
                </Typography>
                {jornadasOrdenadas.length === 0 ? (
                    <Typography sx={labelSx}>
                        No hi ha dades de jornades.
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "minmax(0, 1fr)",
                                sm: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 1.5,
                        }}
                    >
                        {jornadasDestacadas.map((destacado) => (
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
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 1,
                                        minWidth: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            color: "#07152F",
                                            fontWeight: 700,
                                            minWidth: 0,
                                            flex: 1,
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {destacado.jornada?.jornada}
                                    </Typography>
                                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                                        <Typography
                                            sx={{
                                                color: destacado.color,
                                                fontWeight: 900,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {destacado.jornada?.puntos ?? 0} punts
                                        </Typography>
                                        <Typography sx={{ fontSize: "0.75rem", lineHeight: 1.2, color: destacado.color,}}>
                                            {destacado.jornada?.pronosticos ?? 0} {destacado.jornada?.pronosticos === 1 ? "partit" : "partits"}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
            <Box component="fieldset" sx={fieldsetSx}>
                <Typography
                    component="legend"
                    sx={{ px: 1, color: "#07152F", fontWeight: 700 }}
                >
                    Dies
                </Typography>
                {diasOrdenados.length === 0 ? (
                    <Typography sx={labelSx}>
                        Encara no hi ha dades per dies.
                    </Typography>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "minmax(0, 1fr)",
                                sm: "repeat(2, minmax(0, 1fr))",
                            },
                            gap: 1.5,
                        }}
                    >
                        {diasDestacados.map((destacado) => (
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
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 2,
                                            minWidth: 0,
                                            flexWrap: { xs: "wrap", sm: "nowrap" },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: "#07152F",
                                                fontWeight: 700,
                                                minWidth: 0,
                                                flex: 1,
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {formatearDia(destacado.dia?.dia)} ({destacado.dia?.fases.join(", ")})
                                        </Typography>
                                        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                                            <Typography
                                                sx={{
                                                    color: destacado.color,
                                                    fontWeight: 900,
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {destacado.dia?.puntos ?? 0} punts
                                            </Typography>
                                            <Typography sx={{ fontSize: "0.75rem", lineHeight: 1.2, color: destacado.color, }}>
                                                {destacado.dia?.pronosticos ?? 0} {destacado.dia?.pronosticos === 1 ? "partit" : "partits"}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
                </Box>
            </Box>
            {palmares.length > 0 && (
                <Box component="fieldset" sx={{ ...fieldsetSx, mt: 2 }}>
                    <Typography
                        component="legend"
                        sx={{ px: 1, color: "#07152F", fontWeight: 700 }}
                    >
                        Palmarès
                    </Typography>
                    <Box sx={{ display: "grid", gap: 1 }}>
                        {palmares.map((merito) => {
                            const estilo = estilosPalmares[merito.posicion];

                            return (
                                <Box
                                    key={merito.id}
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "minmax(0, 1fr) auto",
                                        },
                                        alignItems: "start",
                                        gap: 1,
                                        px: 1.5,
                                        py: 1.25,
                                        bgcolor: estilo?.background ?? "#F3F6FC",
                                        border: `1px solid ${estilo?.border ?? "#D7DFEB"}`,
                                        borderRadius: "8px",
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                color: "#07152F",
                                                fontWeight: 800,
                                                overflowWrap: "anywhere",
                                            }}
                                        >
                                            {merito.competicion}
                                        </Typography>
                                        <Typography sx={{ ...labelSx, mt: 0.5 }}>
                                            {merito.descripcion}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        sx={{
                                            color: estilo?.color ?? "#53627A",
                                            fontWeight: 800,
                                            textAlign: { xs: "left", sm: "right" },
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {merito.posicion}º lloc
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ParticipanteInfo;
