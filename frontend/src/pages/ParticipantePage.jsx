
import {
    Box,
    CircularProgress,
    Paper,
    Typography,
} from "@mui/material";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getParticipante } from "../api/api";

import ParticipanteBanner from "../components/participantes/ParticipanteBanner";
import ParticipantePorras from "../components/participantes/ParticipantePorras";
import ParticipanteStats from "../components/participantes/ParticipanteStats";

function ParticipantePage() {
    const { participanteId } = useParams();

    const [participante, setParticipante] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setParticipante(null);
        setError(null);

        getParticipante(participanteId)
            .then((data) => {
                setParticipante(data);
            })
            .catch((error) => {
                console.error(error);
                setError("No se ha podido cargar el perfil del participante.");
            });
    }, [participanteId]);

    if (error) {
        return (
            <Paper
                role="alert"
                elevation={0}
                sx={{
                    p: 3,
                    color: "#B42318",
                    bgcolor: "#FFF5F5",
                    border: "1px solid #F3C7C7",
                    borderRadius: "12px",
                }}
            >
                <Typography sx={{ fontWeight: 700 }}>
                    No se ha podido cargar el perfil
                </Typography>

                <Typography sx={{ mt: 0.5 }}>
                    {error}
                </Typography>
            </Paper>
        );
    }

    if (!participante) {
        return (
            <Box
                sx={{
                    minHeight: 240,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                }}
            >
                <CircularProgress />

                <Typography sx={{ color: "#53627A", fontSize: "0.9rem" }}>
                    Cargando perfil...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <ParticipanteBanner participante={participante} />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "minmax(0, 1fr)",
                        md: "minmax(0, 1.7fr) minmax(260px, 1fr)",
                    },
                    alignItems: "start",
                    gap: 3,
                }}
            >
                <ParticipantePorras
                    predicciones={participante.predicciones ?? []}
                />

                <ParticipanteStats />
            </Box>
        </Box>
    );
}

export default ParticipantePage;
