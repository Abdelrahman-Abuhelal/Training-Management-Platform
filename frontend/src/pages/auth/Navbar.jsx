import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useAuth } from "../../provider/authProvider";

export default function LoginButtonAppBar() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });



    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
                <Toolbar>
                    {/* <Box display="flex" justifyContent="center" mb={1}>
                        <img
                            // src="/EXALT_LOGO2.png"
                            // alt="Exalt Logo"
                            style={{ height: "50px", marginBottom: "20px" }}
                        />
                    </Box> */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        EXALT Training Platform
                    </Typography>

                </Toolbar>
            </AppBar>

        </Box>
    );
}
