import {useState} from 'react';
import logo from '../../assets/logo1.jpg'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleOutlined'; 
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import VaccinesRoundedIcon from '@mui/icons-material/VaccinesRounded';
import CasesRoundedIcon from '@mui/icons-material/CasesRounded';
const Sidebarr = () => {
    const [open, setOpen] = useState(true);

    const Menus = [
        {title:"Dashboard"},
        {title:"Raiser Profile", icon:<PeopleRoundedIcon/>},
        {title:"Livestock Inventory", icon:<InventoryRoundedIcon/>},
        {title:"VTT", icon:<VaccinesRoundedIcon/>},
        {title:"MMR", icon:<CasesRoundedIcon/>},
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
                        <>
                            <li key={index} className='text-white text-sm flex items-center gap-x-4 
                            cursor-pointer p-2 hover:bg-[#91ad84] rounded-md mt-2'>
                                <span className='float-left'>
                                   {menu.icon ? menu.icon : <SpaceDashboardRoundedIcon/>}
                                </span>
                                <span className={`text-base font-medium flex-1 duration-300
                                    ${!open && "hidden"}`}>
                                    {menu.title}
                                </span>
                            </li>
                        </>
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