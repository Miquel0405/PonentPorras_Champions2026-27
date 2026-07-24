import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Stack,
    Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useEffect, useMemo, useRef } from "react";
import PartidoCard from "./PartidoCard";

function obtenerClaveDia(fecha) {
    const date = new Date(fecha);

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function formatearDia(clave) {
    const [year, month, day] = clave.split("-").map(Number);

    return new Date(year, month - 1, day).toLocaleDateString(
        "es-ES",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );
}

function Partidos({ partidos }) {
    const navigate = useNavigate();
    const referenciasDias = useRef({});

    const calendario = useMemo(() => {
        if (!partidos?.length) {
            return [];
        }

        const ordenados = [...partidos].sort(
            (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );

        const fases = new Map();

        ordenados.forEach((partido) => {
            const nombreFase = partido.fase?.trim() || "Sin fase";

            if (!fases.has(nombreFase)) {
                fases.set(nombreFase, new Map());
            }

            const dias = fases.get(nombreFase);
            const claveDia = obtenerClaveDia(partido.fecha);

            if (!dias.has(claveDia)) {
                dias.set(claveDia, []);
            }

            dias.get(claveDia).push(partido);
        });

        return Array.from(fases.entries()).map(
            ([nombre, dias]) => ({
                nombre,
                dias: Array.from(dias.entries()).map(
                    ([fecha, partidosDelDia]) => ({
                        fecha,
                        partidos: partidosDelDia,
                    })
                ),
            })
        );
    }, [partidos]);

    useEffect(() => {
        if (!partidos?.length) {
            return;
        }

        const ahora = Date.now();

        const proximos = partidos
            .filter((partido) => {
                const sinResultado =
                    partido.goles_local == null ||
                    partido.goles_visitante == null;

                return (
                    sinResultado &&
                    new Date(partido.fecha).getTime() >= ahora
                );
            })
            .sort(
                (a, b) => new Date(a.fecha) - new Date(b.fecha)
            );

        if (proximos.length === 0) {
            return;
        }

        const partidoProximo = proximos[0];
        const claveDia = obtenerClaveDia(partidoProximo.fecha);
        const nombreFase = partidoProximo.fase?.trim() || "Sin fase";
        const claveReferencia = `${nombreFase}__${claveDia}`;

        referenciasDias.current[claveReferencia]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }, [partidos]);

    if (!partidos || partidos.length === 0) {
        return (
            <Box sx={{ py: 5, textAlign: "center" }}>
                <CalendarMonthIcon
                    sx={{ fontSize: 38, color: "#9AA9BF", mb: 1 }}
                />
                <Typography sx={{ color: "#53627A" }}>
                    No hay partidos disponibles.
                </Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={2}>
            {calendario.map((fase) => (
                <Accordion
                    key={fase.nombre}
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={{
                        border: "1px solid #E1E7F0",
                        borderRadius: "12px !important",
                        overflow: "hidden",
                        "&::before": { display: "none" },
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            px: 2,
                            backgroundColor: "#123C82",
                            color: "#FFFFFF",
                            minHeight: 56,
                            "& .MuiAccordionSummary-content": {
                                alignItems: "center",
                                gap: 1,
                                my: 1.5,
                            },
                            "& .MuiAccordionSummary-expandIconWrapper": {
                                color: "#E8BD65",
                            },
                        }}
                    >
                        <CalendarMonthIcon sx={{ color: "#E8BD65" }} />

                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: "1rem",
                            }}
                        >
                            {fase.nombre}
                        </Typography>

                        <Typography
                            sx={{
                                ml: "auto",
                                mr: 1,
                                color: "#DCE6F5",
                                fontSize: "0.8rem",
                            }}
                        >
                            {fase.dias.reduce(
                                (total, dia) => total + dia.partidos.length,
                                0
                            )}{" "}
                            partidos
                        </Typography>
                    </AccordionSummary>

                    <AccordionDetails sx={{ p: { xs: 1.25, sm: 2 } }}>
                        <Stack spacing={1.5}>
                            {fase.dias.map((dia) => {
                                const claveReferencia =
                                    `${fase.nombre}__${dia.fecha}`;

                                return (
                                    <Box
                                        key={dia.fecha}
                                        ref={(elemento) => {
                                            referenciasDias.current[
                                                claveReferencia
                                            ] = elemento;
                                        }}
                                        sx={{ scrollMarginTop: "90px" }}
                                    >
                                        <Accordion
                                            defaultExpanded
                                            disableGutters
                                            elevation={0}
                                            sx={{
                                                border: "1px solid #E1E7F0",
                                                borderRadius:
                                                    "8px !important",
                                                "&::before": {
                                                    display: "none",
                                                },
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                sx={{
                                                    px: 1.5,
                                                    backgroundColor: "#F3F6FC",
                                                    minHeight: 48,
                                                    "& .MuiAccordionSummary-content":
                                                        {
                                                            my: 1,
                                                        },
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: "#123C82",
                                                        fontWeight: 700,
                                                        textTransform:
                                                            "capitalize",
                                                        fontSize: "0.9rem",
                                                    }}
                                                >
                                                    {formatearDia(dia.fecha)}
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        ml: "auto",
                                                        mr: 1,
                                                        color: "#53627A",
                                                        fontSize: "0.8rem",
                                                    }}
                                                >
                                                    {dia.partidos.length}
                                                </Typography>
                                            </AccordionSummary>

                                            <AccordionDetails sx={{ p: 1.25 }}>
                                                <Stack spacing={1.25}>
                                                    {/* <Button
                                                        variant="outlined"
                                                        onClick={() =>
                                                            navigate(
                                                                `/partidos/dia/${dia.fecha}/participantes`
                                                            )
                                                        }
                                                        sx={{
                                                            alignSelf: "flex-start",
                                                            textTransform: "none",
                                                            fontWeight: 700,
                                                            borderColor: "#3478F6",
                                                            color: "#123C82",
                                                            "&:hover": {
                                                                borderColor: "#123C82",
                                                                backgroundColor: "#EAF1FF",
                                                            },
                                                        }}
                                                    >
                                                        Editar predicciones
                                                    </Button> */}
                                                    <Stack
                                                        direction={{ xs: "column", sm: "row" }}
                                                        spacing={1}
                                                        sx={{ mb: 1.5 }}
                                                        >
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() =>
                                                            navigate(`/partidos/dia/${dia.fecha}/participantes`)
                                                            }
                                                            sx={{
                                                            textTransform: "none",
                                                            fontWeight: 700,
                                                            borderColor: "#3478F6",
                                                            color: "#123C82",
                                                            }}
                                                        >
                                                            Editar predicciones
                                                        </Button>

                                                        <Button
                                                            variant="contained"
                                                            onClick={() =>
                                                            navigate(`/partidos/dia/${dia.fecha}/resultados`)
                                                            }
                                                            sx={{
                                                            textTransform: "none",
                                                            fontWeight: 700,
                                                            backgroundColor: "#123C82",
                                                            "&:hover": { backgroundColor: "#07152F" },
                                                            }}
                                                        >
                                                            Editar resultados reales
                                                        </Button>
                                                    </Stack>

                                                    {dia.partidos.map((partido) => (
                                                        <PartidoCard
                                                            key={partido.id}
                                                            partido={partido}
                                                        />
                                                    ))}
                                                </Stack>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Stack>
    );
}

export default Partidos;
