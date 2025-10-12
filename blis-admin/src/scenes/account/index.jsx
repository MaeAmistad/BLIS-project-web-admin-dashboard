import { doc, setDoc, getDocs, collection} from "firebase/firestore";
import {db} from "../../firebase"; 
import {Button} from "@mui/material";
import { useState, useEffect } from "react";
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";



const Account = () => {

    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [user, setUsers] = useState([]); 

    const Rows = [
        {tableHeader:"No."},
        {tableHeader:"Name"},
        {tableHeader:"Email"},
        {tableHeader:"Password"},
    ]  

    const saveData = async () => {
        const datas={
            name:name,
            email:email,
            password:password,
        }
        // save data to localStorage as a temporary database
        localStorage.setItem('datas', JSON.stringify(datas));
        // save data to firestore
        const docRef = doc(collection(db,'users'));

        await setDoc(docRef, {
            name: datas.name,
            email: datas.email,
            password: datas.password,
        }); 

         // ✅ Reset form fields
        setName("");
        setEmail("");
        setPassword("");

        // console.log("data save to Firestore");
        fetchData(); // refresh table after adding
    };

    // Fetch and display data
    const fetchData = async () => {
        const querySnapshot = await getDocs(
            collection(db, "users")
        );
         const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setUsers(data);
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
                    <Header title="User Account"/>
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
                                {user.map((user, index) => (
                                <tr key={user.id} className="border-b-2 border-black-200 hover:bg-green-50">
                                    <td className="p-3">{index + 1}</td>
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.password}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-1/4 border border border-gray ml-2 p-3">
                        <form>
                            <h4 className="font-bold text-xl text-center">ADD ACCOUNT</h4>
                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Name</label>
                                <div>
                                    <input required value={name} onChange={(e) => {setName(e.target.value)}}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Email</label>
                                <div>
                                    <input required value={email} onChange={(e) => {setEmail(e.target.value)}}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 
                                    text-base text-gray-900 outline outline-1 -outline-offset-1 
                                    outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 
                                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 uppercase" />
                                </div>
                            </div>

                            <div className="mt-8">
                                <label class="block text-base font-medium text-gray-900">Password</label>
                                <div>
                                    <input required value={password} onChange={(e) => {setPassword(e.target.value)}}
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

export default Account;