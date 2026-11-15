import { Box, Typography } from "@mui/material";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const TIPOS_RESULTADO = [
    { id: "plenos", label: "Plenos", field: "plenos", alternateField: "nb_plenos", state: 3, color:"var(--color-text-pleno)"},
    { id: "ddg", label: "DDG", field: "ddg", alternateField: "nb_ddg", state: 2, color: "var(--color-text-ddg)" },
    { id: "x1x2", label: "1X2", field: "x1x2", alternateField: "nb_1x2", state: 1, color: "var(--color-text-1x2)" },
    { id: "errores", label: "Errors", field: "errores", alternateField: "nb_errores", state: 0, color: "var(--color-text-error)",
    },
];

function DistribResultadosParticipante({ participante = {} }) {
    const conteosPorEstado = (participante.pronosticos ?? []).reduce(
        (conteos, pronostico) => {
            const estado = Number(pronostico.estado);
            if (estado >= 0 && estado <= 3) {
                conteos[estado] += 1;
            }
            return conteos;
        },
        [0, 0, 0, 0]
    );

    const datos = TIPOS_RESULTADO.map((tipo) => {
        const total =
            participante[tipo.field] ??
            participante[tipo.alternateField] ??
            conteosPorEstado[tipo.state];
        const value = Number(total);

        return {
            ...tipo,
            value: Number.isFinite(value) && value > 0 ? value : 0,
        };
    }).filter((resultado) => resultado.value > 0);
    const totalResultados = datos.reduce(
        (suma, resultado) => suma + resultado.value,
        0
    );

    return (
        <Box>
            <Typography
                component="h3"
                sx={{ mb: 1, color: "#07152F", fontWeight: 700 }}
            >
                Distribució dels resultats de les porres
            </Typography>
            {totalResultados === 0 ? (
                <Typography sx={{ py: 5, color: "#53627A", textAlign: "center" }}>
                    Encara no hi ha resultats per representar.
                </Typography>
            ) : (
                <>
                    <Box
                        role="img"
                        aria-label={`Distribució circular dels resultats: ${datos
                            .map(({ label, value }) => `${label}: ${value}`)
                            .join(", ")}`}
                    >
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={datos}
                                    dataKey="value"
                                    nameKey="label"
                                    cx="50%"
                                    cy="48%"
                                    outerRadius="76%"
                                    label={({ name, percent }) =>
                                        `${name} ${(percent * 100).toFixed(0)}%`
                                    }
                                    labelLine={false}
                                >
                                    {datos.map((resultado) => (
                                        <Cell
                                            key={resultado.id}
                                            fill={resultado.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [
                                        `${value} (${((value / totalResultados) * 100).toFixed(1)}%)`,
                                        name,
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                    <Typography
                        sx={{
                            color: "#53627A",
                            fontSize: "0.85rem",
                            textAlign: "center",
                        }}
                    >
                        {totalResultados} resultats classificats
                    </Typography>
                </>
            )}
        </Box>
    );
}

export default DistribResultadosParticipante;
