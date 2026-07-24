
import { Box } from "@mui/material";

function EscudoEquipo({ equipo, size = 36 }) {
    const escudo = equipo?.escudo;

    return (
        <Box
            sx={{
                width: size,
                height: size,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
            }}
        >
            {escudo ? (
                <Box
                    component="img"
                    src={escudo}
                    alt={`Escudo de ${equipo.nombre}`}
                    loading="lazy"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                />
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        backgroundColor: "#EAF1FF",
                        color: "#123C82",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: size * 0.35,
                    }}
                >
                    {equipo?.nombre?.charAt(0)?.toUpperCase() ?? "?"}
                </Box>
            )}
        </Box>
    );
}

export default EscudoEquipo;
