
import {
    Box,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getPartidosInicio } from "../../api/api";
import PartidoCard from "./PartidoCard";

function PartidosInicio() {
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setDatos(null);
        setError(null);

        getPartidosInicio()
            .then(setDatos)
            .catch((error) => {
                console.error(error);
                setError("No se han podido cargar los partidos.");
            });
    }, []);

    if (error) {
        return (
            <Typography sx={{ color: "#D94343" }}>
                {error}
            </Typography>
        );
    }

    if (!datos) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size={30} sx={{ color: "#3478F6" }} />
            </Box>
        );
    }

    if (datos.tipo === "ninguno" || !datos.partidos?.length) {
        return (
            <Typography sx={{ color: "#53627A", py: 2 }}>
                No hay próximos partidos.
            </Typography>
        );
    }

    const titulo =
        datos.tipo === "hoy" ? "Partidos de hoy" : "Próximos partidos";

    const fecha = datos.fecha
        ? new Date(`${datos.fecha}T12:00:00`).toLocaleDateString(
              "es-ES",
              {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
              }
          )
        : null;

    return (
        <Box>
            <Typography
                component="h2"
                sx={{
                    color: "#07152F",
                    fontSize: "1.15rem",
                    fontWeight: 800,
                    mb: 0.5,
                }}
            >
                {titulo}
            </Typography>

            {fecha && (
                <Typography
                    sx={{
                        color: "#53627A",
                        fontSize: "0.85rem",
                        textTransform: "capitalize",
                        mb: 2,
                    }}
                >
                    {fecha}
                </Typography>
            )}

            <Stack spacing={1.25}>
                {datos.partidos.map((partido) => (
                    <PartidoCard key={partido.id} partido={partido} />
                ))}
            </Stack>
        </Box>
    );
}

export default PartidosInicio;
