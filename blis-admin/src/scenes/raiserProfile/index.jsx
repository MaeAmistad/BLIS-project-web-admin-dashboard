import { doc, setDoc, getDocs, collection} from "firebase/firestore";
import {db} from "../../firebase"; 
import {Button} from "@mui/material";
import { useState, useEffect } from "react";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";



const RaiserProfile = () => {

    const [fname, setFname]=useState('');
    const [municipal, setMunicipal]=useState('');
    const [brgy, setBrgy]=useState('');
    const [farmsize, setFarmsize]=useState('');
    const [raisers, setRaisers] = useState([]); 

    const Rows = [
        {tableHeader:"ID"},
        {tableHeader:"Full Name"},
        {tableHeader:"Municipal"},
        {tableHeader:"Barangay"},
        {tableHeader:"Farm Size"},
        {tableHeader:"QR"},
    ]  

    const saveData = async () => {
        const datas={
            fname:fname,
            municipal:municipal,
            brgy:brgy,
            farmsize:farmsize,
        }
        // save data to localStorage as a temporary database
        localStorage.setItem('datas', JSON.stringify(datas));
        // save data to firestore
        await setDoc(doc(db, "Raiser"), {
            name: datas.fname,
            municipal: datas.municipal,
            barangay: datas.brgy,
            farmsize: datas.farmsize
        }); 

         // ✅ Reset form fields
        setFname("");
        setMunicipal("");
        setBrgy("");
        setFarmsize("");

        // console.log("data save to Firestore");
        fetchData(); // refresh table after adding
    };

    // Fetch and display data
    const fetchData = async () => {
        const querySnapshot = await getDocs(
            collection(db, "Raiser", "Profile", "PersonalInfo")
        );
         const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setRaisers(data);
        };
        
        useEffect(() => {
            fetchData();
        }, []);

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
                                {raisers.map((raiser, index) => (
                                <tr key={raiser.id} className="border-b-2 border-black-200 hover:bg-green-50">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{raiser.name}</td>
                                    <td className="p-3">{raiser.municipal}</td>
                                    <td className="p-3">{raiser.barangay}</td>
                                    <td className="p-3">{raiser.farmsize}</td>
                                    <td className="text-center">
                                    <Button>View QR</Button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/4 border border border-gray ml-2 p-3">
                        <form>
                            <h4 className="font-bold text-xl text-center">ADD RAISER</h4>
                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Full Name</label>
                                <div>
                                    <input required value={fname} onChange={(e) => {setFname(e.target.value)}}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Municipal</label>
                                <div>
                                    <input required value={municipal} onChange={(e) => {setMunicipal(e.target.value)}}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Barangay</label>
                                <div>
                                    <input required value={brgy} onChange={(e) => {setBrgy(e.target.value)}}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Farm Size</label>
                                <div>
                                    <input value={farmsize} onChange={(e) => {setFarmsize(e.target.value)}}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="text-center mt-6 mb-2">
                                <Button variant="contained" sx={{backgroundColor: "#4CAF50", pl: 5, pr:5, 
                                "&:hover": { backgroundColor: "#45a049" }}} 
                                onClick={saveData}
                                >
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