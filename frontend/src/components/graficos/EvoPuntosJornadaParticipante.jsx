import { Box, Typography } from "@mui/material";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

function obtenerFecha(fecha) {
    return typeof fecha === "string" ? fecha.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] : null;
}

function etiquetaCorta(jornada) {
    const coincidencia = jornada.match(/jornada\s+(.+)$/i);
    return coincidencia ? `J${coincidencia[1]}` : jornada;
}

function EvoPuntosJornadaParticipante({ participante = {} }) {
    const puntosPorJornada = new Map();

    (participante.pronosticos ?? []).forEach((pronostico) => {
        const partido = pronostico.partido;
        const jornada = partido?.fase?.trim() || "Sin fase";
        const fecha = obtenerFecha(partido?.fecha);
        const puntos = Number(pronostico.puntos ?? 0);

        if (!puntosPorJornada.has(jornada)) {
            puntosPorJornada.set(jornada, {
                jornada,
                fecha,
                puntos: 0,
            });
        }

        const estadisticas = puntosPorJornada.get(jornada);
        if (fecha && (!estadisticas.fecha || fecha < estadisticas.fecha)) {
            estadisticas.fecha = fecha;
        }
        estadisticas.puntos += Number.isFinite(puntos) ? puntos : 0;
    });

    let puntosAcumulados = 0;
    const jornadasOrdenadas = [...puntosPorJornada.values()].sort(
        (a, b) =>
            (a.fecha ?? "9999-12-31").localeCompare(b.fecha ?? "9999-12-31") ||
            a.jornada.localeCompare(b.jornada, "ca")
    ).map((jornada) => {
        puntosAcumulados += jornada.puntos;
        return { ...jornada, puntos: puntosAcumulados };
    });
    const datos = jornadasOrdenadas.length > 0
        ? [{ jornada: "Inici", puntos: 0 }, ...jornadasOrdenadas]
        : [];

    return (
        <Box>
            <Typography
                component="h3"
                sx={{ mb: 1, color: "#07152F", fontWeight: 700 }}
            >
                Evolució de punts per jornada
            </Typography>
            {datos.length === 0 ? (
                <Typography sx={{ py: 5, color: "#53627A", textAlign: "center" }}>
                    Encara no hi ha dades per representar.
                </Typography>
            ) : (
                <Box
                    role="img"
                    aria-label={`Evolució de punts per jornada: ${datos
                        .map(({ jornada, puntos }) => `${jornada}: ${puntos} punts acumulats`)
                        .join(", ")}`}
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart
                            data={datos}
                            margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
                        >
                            <CartesianGrid stroke="#E8EDF4" />
                            <XAxis
                                dataKey="jornada"
                                tickFormatter={etiquetaCorta}
                                minTickGap={20}
                            />
                            <YAxis allowDecimals={false} width={32} />
                            <Tooltip
                                labelFormatter={(jornada) => jornada}
                                formatter={(value) => [`${value} punts`, "Punts acumulats"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="puntos"
                                name="Punts acumulats"
                                stroke="#123C82"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            )}
        </Box>
    );
}

export default EvoPuntosJornadaParticipante;