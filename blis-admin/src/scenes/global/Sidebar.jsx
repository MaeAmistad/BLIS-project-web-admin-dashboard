import {useState} from 'react';
import { Link } from "react-router-dom";
import logo from '../../assets/logo1.jpg'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleOutlined'; 
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded';
import CasesRoundedIcon from '@mui/icons-material/CasesRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const Sidebarr = () => {
    const [open, setOpen] = useState(true);
    const [submenuOpen, setSubmenuOpen] = useState(false);

    const Menus = [
        {title:"Dashboard", path:"/dashboard"},
        {title:"Raiser Profile",  path:"/raiserProfile", icon:<PeopleRoundedIcon/>},
        {title:"Livestock", path:"/Ls-inventory",  icon:<InventoryRoundedIcon/>},
        {title:"Vaccination",
            submenu:true,
            submenuItems:[
                {title:"Schedule", path:"/schedule-vaccination"},
                {title:"Under Monitoring", path:"/monitoring-Report"}
            ],
            path:"/vaccinett", icon:<VaccinesRoundedIcon/>},
        {title:"Morbidity & Mortality", path:"/morbility-mortality", icon:<CasesRoundedIcon/>},
    ];
       


    return (
        <div className="flex">
            {/* sidebar */}
            <div className={ ` bg-[#2E7D32] h-screen p-5 pt-8 ${open ? "w-72" : "w-20"} 
            duration-300 relative ` }>
                <ArrowBackIosNewRoundedIcon sx={{ mt:1, fontSize: 40, padding: 1, borderRadius: "50%", backgroundColor: "white" }}
                 className={`text-dark-purple absolute -right-6 cursor-pointer ${!open && "rotate-180"}`} onClick={() => setOpen (!open)}
                />

                <div className='flex justify-center mb-4 mt-8'>
                    <img  src={logo}
                    className={`${open ? "w-24 h-24" : "w-10 h-10 mt-8"} 
                    rounded-xl`} 
                    alt="no-image" />
                </div> 
                <h1 className={`text-white text-center font-medium text-xl p-1 
                    ${!open && "scale-0"}`}>
                        BANTAY LIVESTOCK
                </h1>

                <ul className='pt-2'>
                    {Menus.map((menu, index) => (
                    <div key={index}> 
                        {/* Main Menu Item */}
                        <li
                        className="text-white text-sm flex items-center gap-x-4 
                        cursor-pointer p-2 hover:bg-[#91ad84] rounded-md mt-2"
                        onClick={() => {
                            if (menu.submenu) {
                            setSubmenuOpen(submenuOpen === menu.title ? null : menu.title);
                            }
                        }}
                        >
                        <span className="float-left">
                            {menu.icon ? menu.icon : <SpaceDashboardRoundedIcon />}
                        </span>

                        <Link
                            to={menu.path}
                            className={`text-base font-medium flex-1 duration-300 ${
                            !open && "hidden"
                            }`}
                        >
                            {menu.title}
                        </Link>

                        {menu.submenu && open && (
                            <KeyboardArrowDownRoundedIcon
                            className={`${submenuOpen === menu.title && "rotate-180"}`}
                            />
                        )}
                        </li>

                        {/* Submenu items */}
                        {menu.submenu && submenuOpen === menu.title && open && (
                        <ul>
                            {menu.submenuItems.map((submenuItem, subIndex) => (
                            <Link to={submenuItem.path}>    
                            <li
                                key={subIndex}
                                className="text-white text-sm flex items-center gap-x-4 
                                cursor-pointer p-2 px-5 hover:bg-[#91ad84] rounded-md mt-2"
                            >
                                {submenuItem.title}
                            </li>
                            </Link>
                            ))}
                        </ul>
                        )}
                    </div>
                    ))}
                </ul>

            </div>
{/*             
            
            <div className="p-7">
                <h1 className="text-2xl font-semibold">Home Page</h1>
            </div> */}
        </div>
    )
}

export default Sidebarr;