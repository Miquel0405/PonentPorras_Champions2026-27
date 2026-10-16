
import { useEffect, useState } from "react";
import { Box } from "@mui/material";

function EscudoEquipo({ equipo, size = 36 }) {
    const escudo = equipo?.escudo;

    // Extrae el nombre del archivo, independientemente de si Django
    // devuelve "escudos/equipo.svg" o "/media/escudos/equipo.svg".
    const nombreArchivo = escudo
        ? String(escudo)
              .split(/[?#]/)[0]
              .split("/")
              .filter(Boolean)
              .pop()
        : null;

    const escudoSrc = nombreArchivo
        ? `/escudos/${nombreArchivo}`
        : null;

    const [errorImagen, setErrorImagen] = useState(false);

    useEffect(() => {
        setErrorImagen(false);
    }, [escudoSrc]);

    const mostrarEscudo = escudoSrc && !errorImagen;

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
            {mostrarEscudo ? (
                <Box
                    component="img"
                    src={escudoSrc}
                    alt={`Escudo de ${equipo.nombre}`}
                    loading="lazy"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                    onError={() => setErrorImagen(true)}
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
