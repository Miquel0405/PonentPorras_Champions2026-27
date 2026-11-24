import { Box, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";

function PageBackButton({ to, children, disabled = false, actions }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: actions ? "space-between" : "flex-end",
                gap: 1,
                mb: 2,
                flexWrap: "wrap",
            }}
        >
            {actions}
            <Button
                component={Link}
                to={to}
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                disabled={disabled}
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
                {children}
            </Button>
        </Box>
    );
}

export default PageBackButton;
