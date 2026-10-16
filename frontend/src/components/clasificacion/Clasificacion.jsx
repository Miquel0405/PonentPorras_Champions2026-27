
import {
    Box,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { getClasificacion } from "../../api/api";
import ParticipanteCard from "../participantes/ParticipanteCard";


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
                setError("No s'ha pogut carregar la classificació.");
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
                Encara no hi ha participants en aquesta porra.
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
