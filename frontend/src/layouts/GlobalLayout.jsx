
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import GlobalBanner from "./GlobalBanner";
import GlobalSidebar from "./GlobalSidebar";

function GlobalLayout() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                // backgroundColor: "#F3F6FC",
            }}
        >
            <GlobalBanner />

            <GlobalSidebar />

            <Box
                component="main"
                sx={{
                    pt: "88px",
                    px: { xs: 2, sm: 3, md: 4 },
                    pb: 4,
                    width: "100%",
                    maxWidth: "1600px",
                    mx: "auto",
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}

export default GlobalLayout;
