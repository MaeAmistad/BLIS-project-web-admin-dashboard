import {Button} from "@mui/material";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";


const RaiserProfile = () => {

    const Rows = [
        {tableHeader:"ID"},
        {tableHeader:"Full Name"},
        {tableHeader:"Municipal"},
        {tableHeader:"Barangay"},
        {tableHeader:"Farm Size"},
        {tableHeader:"QR"},
    ] 

    return (
         <div className="flex bg-[#F5F5F5]" >
            <Sidebarr/>
            <div className="w-full">
                <Topbar/>

                <div className="flex justify-between items-center">
                    <Header title="Raiser Profile"/>
                </div>


                <div className="flex bg-white p-2 m-5 overflow-auto rounded-lg">
                    <div className="w-3/4">
                        <table class="table-auto w-full">
                            <thead class="bg-gray-100 border-b-2 border-gray-200 rounded-t-lg">
                                <tr>
                                    {Rows.map((rows, index) => (
                                        <th key={index}
                                            class="p-3 text-sm font-semibold tracking-wide text-center">
                                            {rows.tableHeader}
                                        </th>   
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr class='border-b-2 border-black-200'>
                                    <td class='p-3'>1</td>
                                    <td class='p-3'>2</td>
                                    <td class='p-3'>3</td>
                                    <td class='p-3'>4</td>
                                    <td class='p-3'>5</td>
                                    <td class='text-center'><Button>View QR</Button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/4 border border border-gray ml-2 p-3">
                        <form>
                            <h4 className="font-bold text-xl text-center">ADD RAISER</h4>
                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Full Name</label>
                                <div>
                                    <input required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Municipal</label>
                                <div>
                                    <input required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Barangay</label>
                                <div>
                                    <input required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Farm Size</label>
                                <div>
                                    <input
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="text-center mt-6 mb-2">
                                <Button variant="contained" sx={{backgroundColor: "#4CAF50", pl: 5, pr:5, 
                                "&:hover": { backgroundColor: "#45a049" }}}>
                                    ADD
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                
            </div>
            
        </div>
    )
    
}

export default RaiserProfile;