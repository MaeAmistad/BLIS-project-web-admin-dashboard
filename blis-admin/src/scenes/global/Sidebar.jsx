import {useState} from "react";
import {Sidebar, Menu, MenuItem} from "react-pro-sidebar";
import {Box, Button, IconButton, Typography} from "@mui/material"
import {Link} from "react-router-dom";
import { tokens} from "../../theme";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleOutlined'; 
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded';
import CasesRoundedIcon from '@mui/icons-material/CasesRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

const Item = ({title, to, icon, selected, setSelected}) => {
const colors = tokens();

    return (
        <MenuItem active={selected === title} 
                    // Font Color and Icon
                    style={{color: "#646262ff",}} 
                    onClick={() => setSelected(title)} 
                    icon={icon}>
            <Typography variant="h6">{title}</Typography>
            <Link to={to} />
        </MenuItem>
    )
}

const Sidebarr = () => {
    const colors = tokens();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");


    return (

            <Sidebar collapsed={isCollapsed} style={{background:" #2da035"}}>
                <Menu
                    menuItemStyles={{
                        button: {
                            '&:hover': {
                                backgroundColor: "#2E7D32 !important",
                                color: "white !important",
                                borderRadius: "10px !important",
                                fontWeight: "bold !important",
                                margin:"0 5px 0 5px !important",
                            }
                        }
                        
                    }}
                >
                     {/* *LOGO AND MENU ICON */}
                     <IconButton onClick={() => setIsCollapsed(!isCollapsed)} 
                        style={{
                            padding:"10px",
                            margin:"10px"
                        }}
                     >
                        <MenuRoundedIcon/>
                    </IconButton>
                    {/* <MenuItem onClick={() => setIsCollapsed(!isCollapsed)}
                            icon={isCollapsed ? <MenuRoundedIcon/> : undefined}
                            style={{
                                margin:"5px 0 15px 0",
                                color:colors.grey[900],
                            }}
                        >
                    {!isCollapsed && (
                        <Box style={{display:"flex",
                        justifyContent:"flex-end",
                        alignItems:"center",
                       }}>
                            <IconButton onClick={() => setIsCollapsed(!isCollapsed)} sx={{ p:0, color:colors.grey[600],}}>
                                <ClearRoundedIcon/>
                            </IconButton>
                        </Box>
                    )}
                    </MenuItem>  */}

                    {/* {USER} */}

                    {!isCollapsed && (
                        // LOGO/PROFILE
                        <Box style={{marginBottom:"40px", marginTop:"10px", padding:"5px",}}>
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <img alt="profile-user"
                                width="100px"
                                height="100px"
                                src={"../../assets/logo1.jpg"}
                                style={{cursor:"pointer", borderRadius:"30%"}}
                                />
                            </Box>
                        </Box>
                    )}
                    

                    {/* {MENU ITEMS} */}
                    <Box paddingLeft={isCollapsed ? undefined: "0%"}>

                        <Item
                            title="Dashboard"
                            to="/"
                            icon={<HomeRoundedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Raiser Profile"
                            to="/raiseProf"
                            icon={<PeopleRoundedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="Livestock Inventory"
                            to="/livestockInventory"
                            icon={<InventoryRoundedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="VTT"
                            to="/vtt"
                            icon={<VaccinesRoundedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />
                        <Item
                            title="MMR"
                            to="/mormor"
                            icon={<CasesRoundedIcon/>}
                            selected={selected}
                            setSelected={setSelected}
                        />

                    </Box>
                </Menu>
            </Sidebar>

    )
}

export default Sidebarr;