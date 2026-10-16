
import {
    Box,
    CircularProgress,
    Paper,
    Typography,
    Stack,
    Button,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
             <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3, position: "relative"}}
            >
                <Box sx={{ mb: 3 }}>
                    <Typography
                        component="h1"
                        sx={{
                            mb: 0.75,
                            color: "#FFFFFF",
                            fontSize: { xs: "1.6rem", md: "2rem" },
                            fontWeight: 800,
                            lineHeight: 1.2,
                        }}
                    >
                        Partits
                    </Typography>

                    <Typography sx={{ color: "#eaf1ffdb", fontSize: "0.95rem" }}>
                        Consulta el calendari complet de la competició, els resultats o accedeix a un partit concret per veure els detalls i les porres.
                    </Typography>
                </Box>
                <Box
                    sx={{
                        position : "absolute",
                        top: 0,
                        right: 0,
                    }}
                >
                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        startIcon={<BackIcon />}
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
                        Tornar al inici
                    </Button>
                </Box>
            </Stack>

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
