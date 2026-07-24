import {
    Box,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getPartido } from "../api/api";
import PartidoBanner from "../components/partidos/PartidoBanner";
import PartidoPorras from "../components/partidos/PartidoPorras";

function PartidoPage() {
    const { partidoId } = useParams();

    const [partido, setPartido] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setPartido(null);
        setError(null);

        getPartido(partidoId)
            .then(setPartido)
            .catch((error) => {
                console.error(error);
                setError("No se ha podido cargar el partido.");
            });
    }, [partidoId]);

    if (error) {
        return (
            <Box>
                <Typography sx={{ color: "#D94343" }}>
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!partido) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 6,
                }}
            >
                <CircularProgress sx={{ color: "#3478F6" }} />
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mb: 2,
                }}
            >
                <Button
                    component={Link}
                    to={`/partidos/${partidoId}/editar`}
                    variant="contained"
                    startIcon={<EditOutlinedIcon />}
                    sx={{
                        backgroundColor: "#123C82",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                            backgroundColor: "#3478F6",
                        },
                    }}
                >
                    Editar Partido
                </Button>
            </Box>

            <PartidoBanner partido={partido} />

            <PartidoPorras
                predicciones={partido.predicciones ?? []}
            />
        </Box>
    );
}

export default PartidoPage;