
import {
    Box,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EscudoEquipo from "../partidos/EscudoEquipo";

function ParticipanteTablaEquipos({ pronosticos = [] }) {
    const equiposPorId = new Map();

    pronosticos.forEach((pronostico) => {
        const partido = pronostico.partido;
        const puntos = Number(pronostico.puntos ?? 0);

        const equiposDelPartido = new Map(
            [partido?.equipo_local, partido?.equipo_visitante]
                .filter((equipo) => equipo && equipo.id != null)
                .map((equipo) => [equipo.id, equipo])
        );

        equiposDelPartido.forEach((equipo) => {
            if (!equiposPorId.has(equipo.id)) {
                equiposPorId.set(equipo.id, {
                    equipo,
                    puntos: 0,
                    pronosticos: 0,
                    plenos: 0,
                    ddg: 0,
                    x1x2: 0,
                    errores: 0,
                });
            }

            const estadisticas = equiposPorId.get(equipo.id);
            estadisticas.puntos += Number.isFinite(puntos) ? puntos : 0;
            estadisticas.pronosticos += 1;

            switch (Number(pronostico.estado)) {
                case 3:
                    estadisticas.plenos += 1;
                    break;
                case 2:
                    estadisticas.ddg += 1;
                    break;
                case 1:
                    estadisticas.x1x2 += 1;
                    break;
                case 0:
                    estadisticas.errores += 1;
                    break;
                default:
                    break;
            }
        });
    });

    const equiposOrdenados = [...equiposPorId.values()].sort(
        (a, b) =>
            b.puntos - a.puntos ||
            a.pronosticos - b.pronosticos ||
            b.plenos - a.plenos ||
            b.ddg - a.ddg ||
            b.x1x2 - a.x1x2 ||
            a.equipo.nombre.localeCompare(b.equipo.nombre, "es")
    );

    if (equiposOrdenados.length === 0) {
        return (
            <Box
                sx={{
                    py: 4,
                    px: 2,
                    textAlign: "center",
                    border: "1px dashed #D4DEEC",
                    borderRadius: "10px",
                    bgcolor: "#F8FAFE",
                }}
            >
                Encara no hi ha dades per mostrar.
            </Box>
        );
    }

    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: "1px solid #848484", //E1E7F0
                borderRadius: "10px",
                overflowX: "auto",
            }}
        >
            <Table
                aria-label="Puntuació del participant per equip"
                sx={{ minWidth: 840, tableLayout: "fixed", width: "100%" }}
            >
                <colgroup>
                    <col style={{ width: "5%" }} />
                    <col style={{ width: "28%" }} />
                    <col span={6} style={{ width: "11.1667%" }} />
                </colgroup>
                <TableHead>
                    <TableRow sx={{ bgcolor: "#F3F6FC" }}> 
                        <TableCell aria-hidden="true" sx={{ py: 1 }} />
                        <TableCell sx={{ py: 1, fontWeight: 800, color: "#07152F" }}>
                            Equip
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1, fontWeight: 800, color: "#07152F", whiteSpace: "nowrap" }}>
                            Punts totals
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1, fontWeight: 800, color: "#07152F", whiteSpace: "nowrap" }}>
                            Nº Porres
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1, fontWeight: 800, color: "#07152F", whiteSpace: "nowrap" }}>
                            Nº Plenos
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1, fontWeight: 800, color: "#07152F", whiteSpace: "nowrap" }}>
                            Nº DDG
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1, fontWeight: 800, color: "#07152F", whiteSpace: "nowrap" }}>
                            Nº 1X2
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1, fontWeight: 800, color: "#07152F", whiteSpace: "nowrap" }}>
                            Nº Errors
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {equiposOrdenados.map((estadisticas, index) => {
                        const posicion =
                            equiposOrdenados.length > 1
                                ? index / (equiposOrdenados.length - 1)
                                : 0;
                        const colorFila = `hsl(${120 * (1 - posicion)} 65% 85%)`;
                        const esMejor = index === 0;
                        const esPeor = index === equiposOrdenados.length - 1;

                        return (
                            <TableRow
                                key={estadisticas.equipo.id}
                                sx={{
                                    bgcolor: colorFila,
                                    "&:last-child td": { borderBottom: 0 },
                                }}
                            >
                                <TableCell align="center" sx={{ py: 0.75, fontWeight: 800 }}>
                                    {index + 1}
                                </TableCell>
                                <TableCell sx={{ py: 0.75 }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx = {{ width: "100%", height: "100%", justifyContent: { xs: "center", sm: "flex-start" } }}>
                                        <EscudoEquipo equipo={estadisticas.equipo} size={32} />
                                        <Typography sx={{ fontWeight: 700, color: "#07152F", display: "flex", alignItems: "center", m: 0}}>
                                            {estadisticas.equipo.nombre}
                                        </Typography>
                                        {esMejor && (
                                            <TrendingUpIcon
                                                titleAccess="Millor puntuació"
                                                sx={{ color: "#2E7D32", fontSize: 30, flexShrink: 0 }}
                                            />
                                        )}
                                        {esPeor && (
                                            <TrendingDownIcon
                                                titleAccess="Pitjor puntuació"
                                                sx={{ color: "#B42318", fontSize: 30, flexShrink: 0 }}
                                            />
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.75, fontWeight: 900, color: "#123C82" }}>
                                    {estadisticas.puntos}
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.75 }}>
                                    {estadisticas.pronosticos}
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.75 }}>
                                    {estadisticas.plenos}
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.75 }}>
                                    {estadisticas.ddg}
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.75 }}>
                                    {estadisticas.x1x2}
                                </TableCell>
                                <TableCell align="right" sx={{ py: 0.75 }}>
                                    {estadisticas.errores}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ParticipanteTablaEquipos;
