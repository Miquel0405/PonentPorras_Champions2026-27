
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import GroupsIcon from "@mui/icons-material/Groups";

import { NavLink } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 240;
const bannerHeight = 68;

function GlobalSidebar() {
    const [open, setOpen] = useState(false);

    const menuItems = [
        {
            text: "Inicio",
            icon: <HomeIcon />,
            path: "/",
            end: true,
        },
        {
            text: "Clasificación",
            icon: <EmojiEventsIcon />,
            path: "/clasificacion",
        },
        {
            text: "Partidos",
            icon: <SportsSoccerIcon />,
            path: "/partidos",
        },
    ];

    return (
        <>
            {/* Franja lateral que activa el menú */}
            <Box
                onMouseEnter={() => setOpen(true)}
                onFocus={() => setOpen(true)}
                onClick={() => setOpen((previous) => !previous)}
                role="button"
                tabIndex={0}
                aria-label="Abrir menú de navegación"
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setOpen((previous) => !previous);
                    }
                }}
                sx={{
                    position: "fixed",
                    top: `${bannerHeight}px`,
                    left: 0,
                    width: "12px",
                    height: `calc(100vh - ${bannerHeight}px)`,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    cursor: "pointer",
                }}
            />

            <Drawer
                variant="temporary"
                anchor="left"
                open={open}
                onClose={() => setOpen(false)}
                ModalProps={{
                    hideBackdrop: true,
                    keepMounted: true,
                }}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        top: `${bannerHeight}px`,
                        height: `calc(100% - ${bannerHeight}px)`,
                        color: "#FFFFFF",
                        backgroundColor: "#07152F",
                        borderRight: "1px solid #1C3765",
                    },
                }}
            >
                <Box
                    onMouseLeave={() => setOpen(false)}
                    sx={{ height: "100%", py: 2 }}
                >
                    <Typography
                        sx={{
                            px: 3,
                            py: 1.5,
                            color: "#91A9D2",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                        }}
                    >
                        Navegación
                    </Typography>

                    <List sx={{ px: 1.5 }}>
                        {menuItems.map((item) => (
                            <ListItem
                                key={item.path}
                                disablePadding
                                sx={{ mb: 0.5 }}
                            >
                                <ListItemButton
                                    component={NavLink}
                                    to={item.path}
                                    end={item.end}
                                    onClick={() => setOpen(false)}
                                    sx={{
                                        minHeight: 46,
                                        px: 2,
                                        borderRadius: "8px",
                                        color: "#D8E3F7",
                                        transition: "background-color 150ms ease",
                                        "& .MuiListItemIcon-root": {
                                            minWidth: 40,
                                            color: "inherit",
                                        },
                                        "&:hover": {
                                            backgroundColor: "#142B50",
                                            color: "#FFFFFF",
                                        },
                                        "&.active": {
                                            backgroundColor: "#3478F6",
                                            color: "#FFFFFF",
                                            fontWeight: 700,
                                            "& .MuiListItemIcon-root": {
                                                color: "#E8BD65",
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontSize: "0.9rem",
                                            fontWeight: "inherit",
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>
    );
}

export default GlobalSidebar;
