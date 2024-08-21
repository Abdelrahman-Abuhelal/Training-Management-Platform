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

                    <Typography variant="h6" component="div"  sx={{ fontSize: { xs: '1.0rem', sm: '1.5rem' } }}>
                        EXALT Training Platform
                    </Typography>

                </Toolbar>
            </AppBar>

        </Box>
    );
}
