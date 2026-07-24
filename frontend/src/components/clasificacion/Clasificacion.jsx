
import {
    Box,
    CircularProgress,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useEffect, useState } from "react";

import { getClasificacion } from "../../api/api";
import ParticipanteCard from "../participantes/ParticipanteCard";

const estilosPosicion = {
    1: {
        borde: "#E8BD65",
        fondo: "#FFFCF0",
        insignia: "#E8BD65",
        colorTexto: "#07152F",
    },
    2: {
        borde: "#B8C2CF",
        fondo: "#F5F7FA",
        insignia: "#C5CDD7",
        colorTexto: "#07152F",
    },
    3: {
        borde: "#BC8056",
        fondo: "#FBF2EB",
        insignia: "#BC8056",
        colorTexto: "#FFFFFF",
    },
};

function Clasificacion() {
    const [clasificacion, setClasificacion] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getClasificacion()
            .then((data) => {
                setClasificacion(data);
            })
            .catch((error) => {
                console.error(error);
                setError("No se ha podido cargar la clasificación.");
            });
    }, []);

    if (error) {
        return (
            <Typography color="error" role="alert">
                {error}
            </Typography>
        );
    }

    if (clasificacion === null) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (clasificacion.length === 0) {
        return (
            <Typography color="text.secondary">
                Todavía no hay participantes en esta porra.
            </Typography>
        );
    }
    
    return (
        <Stack spacing={1.5}>
            {clasificacion.map((participante, index) => (
                <ParticipanteCard
                    key={participante.participante}
                    participante={participante}
                    posicion={index + 1}
                />
            ))}
        </Stack>
    );

}

export default Clasificacion;
