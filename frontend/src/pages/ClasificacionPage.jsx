
import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";
import { Link} from "react-router-dom";
import Clasificacion from "../components/clasificacion/Clasificacion";

function ClasificacionPage() {
    return (
        <Box>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 3, position: "relative"}}
            >
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
                        Clasificació
                    </Typography>

                    <Typography
                        sx={{
                            color: "#eaf1ffdb",
                            fontSize: "0.95rem",
                        }}
                    >
                        Consulta la clasificació completa amb més detall o entra als detalls de un participant.
                    </Typography>
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
                <Clasificacion />
            </Paper>
        </Box>
    );
}

export default ClasificacionPage;
