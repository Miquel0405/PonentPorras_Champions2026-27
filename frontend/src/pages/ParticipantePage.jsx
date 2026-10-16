
import {
    Box,
    CircularProgress,
    Paper,
    Tab,
    Tabs,
    Typography,
    Button,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import BackIcon from "@mui/icons-material/ArrowBack";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getParticipante } from "../api/api";

import ParticipanteBanner from "../components/participantes/ParticipanteBanner";
import ParticipanteInfo from "../components/participantes/ParticipanteInfo";
import ParticipantePorras from "../components/participantes/ParticipantePorras";
import ParticipanteGraphs from "../components/participantes/ParticipanteGraphs";

function ParticipantePage() {
    const { participanteId } = useParams();

    const [participante, setParticipante] = useState(null);
    const [error, setError] = useState(null);
    const [seccionActiva, setSeccionActiva] = useState(0);

    useEffect(() => {
        setParticipante(null);
        setError(null);

        getParticipante(participanteId)
            .then((data) => {
                setParticipante(data);
            })
            .catch((error) => {
                console.error(error);
                setError("No s'ha pogut carregar el perfil del participant.");
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
                    No s'ha pogut carregar el perfil
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
                    Carregant perfil...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mb: 2,
                }}
            >
                <Button
                    component={Link}
                    to="/clasificacion"
                    variant="outlined"
                    startIcon={<BackIcon/>}
                    sx={{
                        color: "#F3F6FC",
                        borderColor: "#123C82",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 700,
                        "&:hover": {
                            backgroundColor: "#3478F6",
                        },
                    }}
                >
                    Tornar a la classificació
                </Button>
            </Box>
            <ParticipanteBanner participante={participante} />

            <Paper
                elevation={0}
                sx={{
                    mb: 3,
                    px: { xs: 2, sm: 3 },
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E1E7F0",
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgb(7 21 47 / 6%)",
                    overflow: "hidden",
                }}
            >
                <Tabs
                    value={seccionActiva}
                    onChange={(_, value) => setSeccionActiva(value)}
                    aria-label="Secciones del participante"
                    variant="right"
                    sx={{
                        minHeight: 56,
                        "& .MuiTabs-indicator": {
                            height: 3,
                            bgcolor: "#E8BD65",
                        },
                        "& .MuiTab-root": {
                            minHeight: 56,
                            color: "#53627A",
                            fontSize: { xs: "0.8rem", sm: "0.95rem" },
                            fontWeight: 700,
                            textTransform: "none",
                            "&.Mui-selected": {
                                color: "#07152F",
                            },
                            "&:hover": {
                                bgcolor: "#F3F6FC",
                            },
                        },
                    }}
                >
                    <Tab
                        id="participante-tab-informacion"
                        aria-controls="participante-panel-informacion"
                        icon={<InfoOutlinedIcon />}
                        iconPosition="start"
                        label="Informació"
                    />
                    <Tab
                        id="participante-tab-porras"
                        aria-controls="participante-panel-porras"
                        icon={<SportsSoccerIcon />}
                        iconPosition="start"
                        label={`Porres (${participante.pronosticos?.length ?? 0})`}
                    />
                    <Tab
                        id="participante-tab-graficas"
                        aria-controls="participante-panel-graficas"
                        icon={<BarChartOutlinedIcon />}
                        iconPosition="start"
                        label="Gràfiques"
                    />
                </Tabs>

                <Box
                    sx={{
                            ml: "auto !important",
                            px: 1.25,
                            py: 2,
                            borderRadius: "20px",
                            fontSize: "0.8rem",
                            fontWeight: 800,
                        }}
                    role="tabpanel"
                    id={[
                        "participante-panel-informacion",
                        "participante-panel-porras",
                        "participante-panel-graficas",
                    ][seccionActiva]}
                    aria-labelledby={[
                        "participante-tab-informacion",
                        "participante-tab-porras",
                        "participante-tab-graficas",
                    ][seccionActiva]}
                    tabIndex={0}
                >
                    {seccionActiva === 0 ? (
                        <ParticipanteInfo participante={participante} />
                    ) : seccionActiva === 1 ? (
                        <ParticipantePorras
                            pronosticos={participante.pronosticos ?? []}
                        />
                    ) : (
                        <ParticipanteGraphs />
                    )}
                </Box>
            </Paper>
        </Box>
    );
}

export default ParticipantePage;
