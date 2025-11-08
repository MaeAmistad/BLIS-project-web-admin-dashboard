import * as React from 'react';
import {Link} from 'react-router-dom';
import {Box, IconButton, Typography,Toolbar, Menu, Container, Tooltip, MenuItem} from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

// const settings = ['Profile', 'Account', 'Logout'];

const settings = [
    {title:"Log-out", path:'/'},
]

const Topbar = () => {
const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
          <Container maxWidth="l" sx={{ bgcolor: "#ffffff"}}>
        <Toolbar disableGutters >
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                fontFamily: "Poppins",
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: " #424242",
                textDecoration: 'none', 
                ml:1,
            }}
          >
            Bantay Livestock Information and Registration System
          </Typography>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ p:1, border:"1px solid #d0d1d5"}}>
                <NotificationsOutlinedIcon sx={{ fontSize: 20 }}/>
            </IconButton>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p:1, mr:3, ml:.5, border:"1px solid #d0d1d5"}}>
                 <PersonOutlinedIcon sx={{ fontSize: 20 }}/>
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
                <Link to={setting.path}>
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting.title}</Typography>
                </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>

        </Toolbar>
      </Container>

  );
}
export default Topbar;
