
import {
    Box,
    CircularProgress,
    Paper,
    Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getPartidos } from "../api/api";
import Partidos from "../components/partidos/Partidos";

function PartidosPage() {

    const [partidos, setPartidos] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setPartidos(null);
        setError(null);

        getPartidos()
            .then(setPartidos)
            .catch((error) => {
                console.error(error);
                setError("No se han podido cargar los partidos.");
            });
    }, []);

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography
                    component="h1"
                    sx={{
                        mb: 0.75,
                        color: "#07152F",
                        fontSize: { xs: "1.6rem", md: "2rem" },
                        fontWeight: 800,
                        lineHeight: 1.2,
                    }}
                >
                    Partidos
                </Typography>

                <Typography sx={{ color: "#53627A", fontSize: "0.95rem" }}>
                    Consulta el calendario, los resultados y los pronósticos.
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 3 },
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E1E7F0",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgb(7 21 47 / 6%)",
                }}
            >
                {error ? (
                    <Typography sx={{ color: "#D94343" }}>
                        {error}
                    </Typography>
                ) : !partidos ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 5,
                        }}
                    >
                        <CircularProgress sx={{ color: "#3478F6" }} />
                    </Box>
                ) : (
                    <Partidos partidos={partidos} />
                )}
            </Paper>
        </Box>
    );
}

export default PartidosPage;
