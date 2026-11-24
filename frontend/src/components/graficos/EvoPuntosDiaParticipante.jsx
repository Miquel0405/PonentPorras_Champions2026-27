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

function formatearFecha(fecha) {
    if (fecha === "Inici") {
        return fecha;
    }

    const [year, month, day] = fecha.split("-");
    return `${day}/${month}/${year}`;
}

function EvoPuntosDiaParticipante({ participante = {} }) {
    const puntosPorDia = new Map();

    (participante.pronosticos ?? []).forEach((pronostico) => {
        const fecha = pronostico.partido?.fecha;
        const coincidencia = typeof fecha === "string"
            ? fecha.match(/^(\d{4}-\d{2}-\d{2})/)
            : null;

        if (!coincidencia) {
            return;
        }

        const puntos = Number(pronostico.puntos ?? 0);
        puntosPorDia.set(
            coincidencia[1],
            (puntosPorDia.get(coincidencia[1]) ?? 0) +
                (Number.isFinite(puntos) ? puntos : 0)
        );
    });

    let puntosAcumulados = 0;
    const diesOrdenats = [...puntosPorDia.entries()]
        .sort(([fechaA], [fechaB]) => fechaA.localeCompare(fechaB))
        .map(([fecha, puntos]) => {
            puntosAcumulados += puntos;
            return { fecha, puntos: puntosAcumulados };
        });
    const datos = diesOrdenats.length > 0
        ? [{ fecha: "Inici", puntos: 0 }, ...diesOrdenats]
        : [];

    return (
        <Box>
            <Typography
                component="h3"
                sx={{ mb: 1, color: "#07152F", fontWeight: 700 }}
            >
                Evolució de punts per dia
            </Typography>
            {datos.length === 0 ? (
                <Typography sx={{ py: 5, color: "#53627A", textAlign: "center" }}>
                    Encara no hi ha dades per representar.
                </Typography>
            ) : (
                <Box
                    role="img"
                    aria-label={`Evolució de punts per dia: ${datos
                        .map(({ fecha, puntos }) => `${formatearFecha(fecha)}: ${puntos} punts acumulats`)
                        .join(", ")}`}
                >
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart
                            data={datos}
                            margin={{ top: 8, right: 12, bottom: 8, left: 0 }}
                        >
                            <CartesianGrid stroke="#E8EDF4" />
                            <XAxis
                                dataKey="fecha"
                                tickFormatter={(fecha) =>
                                    fecha === "Inici"
                                        ? fecha
                                        : fecha.slice(8, 10) + "/" + fecha.slice(5, 7)
                                }
                                minTickGap={20}
                            />
                            <YAxis allowDecimals={false} width={32} />
                            <Tooltip
                                labelFormatter={(fecha) =>
                                    fecha === "Inici"
                                        ? fecha
                                        : `Data: ${formatearFecha(fecha)}`
                                }
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

export default EvoPuntosDiaParticipante;