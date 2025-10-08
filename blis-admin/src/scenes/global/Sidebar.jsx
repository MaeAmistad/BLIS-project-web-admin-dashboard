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
        {title:"Dashboard", path:"/"},
        {title:"Raiser Profile",  path:"/raiserProfile", icon:<PeopleRoundedIcon/>},
        {title:"Livestock", path:"/Lsinventory",  icon:<InventoryRoundedIcon/>},
        {title:"Vaccination",
            submenu:true,
            submenuItems:[
                {title:"Schedule"},
                {title:"Under Monitoring"}
            ],
            path:"/vaccinett", icon:<VaccinesRoundedIcon/>},
        {title:"Morbidity & Mortality", path:"/mortabilitymr", icon:<CasesRoundedIcon/>},
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
                        <Link to={menu.path} key={index}>
                            <li key={index} className='text-white text-sm flex items-center gap-x-4 
                            cursor-pointer p-2 hover:bg-[#91ad84] rounded-md mt-2'>
                                <span className='float-left'>
                                   {menu.icon ? menu.icon : <SpaceDashboardRoundedIcon/>}
                                </span>
                                <span className={`text-base font-medium flex-1 duration-300
                                    ${!open && "hidden"}`}>
                                    {menu.title}
                                </span>
                                {menu.submenu && open && (
                                    <KeyboardArrowDownRoundedIcon className={`${submenuOpen && "rotate-180"  }`}  onClick={() => setSubmenuOpen (!submenuOpen)}/>
                                )}
                            </li>
                            {menu.submenu && submenuOpen && open &&(
                                <ul>
                                    {menu.submenuItems.map((submenuItems,index) => (
                                        <li key={index} className='text-white text-sm flex items-center gap-x-4 
                                            cursor-pointer p-2 px-5 hover:bg-[#91ad84] rounded-md mt-2'>
                                            {submenuItems.title}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Link>
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