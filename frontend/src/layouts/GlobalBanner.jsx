
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

function GlobalBanner() {
    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: "linear-gradient(100deg, #07152F 0%, #123C82 100%)",
                borderBottom: "2px solid #E8BD65",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar
                sx={{
                    minHeight: "68px !important",
                    px: { xs: 2, md: 4 },
                }}
            >
                <Box
                    sx={{
                        width: 4,
                        height: 36,
                        mr: 2,
                        borderRadius: 2,
                        bgcolor: "#E8BD65",
                        flexShrink: 0,
                    }}
                />

                <Box>
                    <Typography
                        component="div"
                        sx={{
                            color: "#FFFFFF",
                            fontWeight: 800,
                            fontSize: { xs: "1rem", md: "1.2rem" },
                            letterSpacing: "0.02em",
                            lineHeight: 1.4,
                        }}
                    >
                        Ponent Porras
                    </Typography>

                    <Typography
                        component="div"
                        sx={{
                            color: "#C7D5F0",
                            fontSize: { xs: "0.7rem", md: "0.8rem" },
                            letterSpacing: "0.08em",
                        }}
                    >
                        CHAMPIONS LEAGUE · 2026–2027
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default GlobalBanner;
