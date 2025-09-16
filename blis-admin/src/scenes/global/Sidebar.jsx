import {useState} from "react";
import {Sidebar, Menu, MenuItem} from "react-pro-sidebar";
import {Box, IconButton, Typography, useTheme} from "@mui/material"
// import 'react-pro-sidebar/dist/scss/styles.scss';
import {Link} from "react-router-dom";
import { tokens} from "../../theme";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';


const Sidebarr = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");

    return (
        <Box
            sx={{
                "& .pro-sidebar-inner":{
                    background: '${color.primary[400]} !important',
                },
                "& .pro-icon-wrapper": {
                    backgroundColor:"transparent !important",
                },
                "& .pro-inner-item": {
                    padding:"5px 35px 5px 20px !important",
                },
                "& .pro-inner-item:hover":{
                    color: "#868dfb !important",
                },
                "& .pro-menu-item.active":{
                    color:"#6870fa !important",
                },
            }}>

            <Sidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    {/**LOGO AND MENU ICON */}
                    <MenuItem onClick={() => setIsCollapsed(!isCollapsed)}
                    icon={isCollapsed ? <MenuOutlinedIcon/> : undefined}
                    style={{
                        margin:"10px 0 20px 0",
                        color:colors.grey[100],
                    }}
                    >
                    {!isCollapsed && (
                        <Box display="flex" 
                        justifyContent="space-between"
                        alignItems="center"
                        ml="15px"
                        >
                            <Typography>ADMIN</Typography>
                            <IconButton><MenuOutlinedIcon/></IconButton>
                        </Box>
                    )}
                    </MenuItem>
                </Menu>
            </Sidebar>

            </Box>
    )
}

export default Sidebarr;