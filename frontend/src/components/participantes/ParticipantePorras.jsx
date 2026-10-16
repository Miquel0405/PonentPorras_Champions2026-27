
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
} from "@mui/material";
import { useState } from "react";

import PronosticoParticipanteCard from "../pronosticos/PronosticoParticipanteCard";

function ParticipantePorras({ pronosticos = [] }) {
    const [orden, setOrden] = useState("fecha-desc");

    if (pronosticos.length === 0) {
        return (
            <Box
                sx={{
                    py: 4,
                    px: 2,
                    textAlign: "center",
                    border: "1px dashed #D4DEEC",
                    borderRadius: "10px",
                    bgcolor: "#F8FAFE",
                }}
            >
                Encara no hi ha porres. Aquest participant encara no s'ha atrevit a tirar cap porra.
            </Box>
        );
    }

    const pronosticosOrdenados = [...pronosticos].sort((a, b) => {
        if (orden.startsWith("fecha")) {
            const fechaA = new Date(a.partido.fecha).getTime();
            const fechaB = new Date(b.partido.fecha).getTime();
            const ambasFechasValidas =
                Number.isFinite(fechaA) && Number.isFinite(fechaB);

            if (!ambasFechasValidas) {
                if (Number.isFinite(fechaA)) return -1;
                if (Number.isFinite(fechaB)) return 1;
                return 0;
            }

            return orden === "fecha-desc" ? fechaB - fechaA : fechaA - fechaB;
        }

        const puntosA = Number(a.puntos ?? 0);
        const puntosB = Number(b.puntos ?? 0);
        return orden === "puntos-desc" ? puntosB - puntosA : puntosA - puntosB;
    });

    return (
        <Box>
            <FormControl
                size="small"
                sx={{ mb: 2, minWidth: { xs: "100%", sm: 240 } }}
            >
                <InputLabel id="orden-porras-label">Ordenar per</InputLabel>
                <Select
                    labelId="orden-porras-label"
                    id="orden-porras"
                    value={orden}
                    label="Ordenar per"
                    onChange={(event) => setOrden(event.target.value)}
                >
                    <MenuItem value="fecha-desc">Data: més recent</MenuItem>
                    <MenuItem value="fecha-asc">Data: més antiga</MenuItem>
                    <MenuItem value="puntos-desc">Puntuació: de major a menor</MenuItem>
                    <MenuItem value="puntos-asc">Puntuació: de menor a major</MenuItem>
                </Select>
            </FormControl>

            <Stack spacing={1.5}>
                {pronosticosOrdenados.map((pronostico) => (
                    <PronosticoParticipanteCard
                        key={pronostico.id}
                        pronostico={pronostico}
                    />
                ))}
            </Stack>
        </Box>
    );
}

export default ParticipantePorras;
