import * as React from 'react';
import {Box, IconButton, Typography, AppBar,Toolbar, Menu, Container, Tooltip, MenuItem} from "@mui/material";
import { tokens } from "../../theme";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";


const colors = tokens();
const settings = ['Profile', 'Account', 'Logout'];

function Topbar() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
      <Container maxWidth="l">
        <Toolbar disableGutters>
          <Typography
            variant="h3"
            noWrap
            component="a"
            sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                fontFamily: "Roboto",
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: " #424242",
                textDecoration: 'none',
            }}
          >
            BANTAY LIVESTOCK INVENTORY SYSTEM
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ p:1, color:colors.grey[900], border:"1px solid #d0d1d5"}}>
                <NotificationsOutlinedIcon/>
            </IconButton>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p:1, mr:3, ml:.5, color:colors.grey[900], border:"1px solid #d0d1d5"}}>
                 <PersonOutlinedIcon/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
  );
}
export default Topbar;
