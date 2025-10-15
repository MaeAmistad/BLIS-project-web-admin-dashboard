import {useState} from 'react';
import {Button} from '@mui/material'
import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";

const VaccineTracking = () => {

  const [vaccinated, setVaccinated] = useState(true);

  const Rows1 = [
        {tableHeader:"No."},
        {tableHeader:"Date"},
        {tableHeader:"Livestock Inspector"},
        {tableHeader:"Municipality"},
        {tableHeader:"Barangay"},
        {tableHeader:"Name of Owner"},
        {tableHeader:"Contact No."},
        {tableHeader:"Species"},
        {tableHeader:"Pet Name"},
        {tableHeader:"Sex"},
        {tableHeader:"Age"},
        {tableHeader:"Vaccined Used"},
        {tableHeader:"Lot #"},
        {tableHeader:"Remarks"},
    ]  

     const Rows2 = [
        {tableHeader:"No."},
        {tableHeader:"Date"},
        {tableHeader:"Livestock Inspector"},
        {tableHeader:"Municipality"},
        {tableHeader:"Barangay"},
        {tableHeader:"Name of Owner"},
        {tableHeader:"Contact No."},
        {tableHeader:"No. of Dog"},
        {tableHeader:"No. of Cats"},
        {tableHeader:"Reasons"},
        {tableHeader:"Remarks"},
    ]  

    return (
      <div className="flex bg-[#F5F5F5]">
        <Sidebarr/>
            <div className="w-full">
                <Topbar/>

                 <div className="flex justify-between items-center">
                    <Header title="Vaccine and Treatment"/>
                </div>

                <div>
                  <Button variant="outlined" 
                  sx={{ml:'25px',borderColor: '#45a049', color:'#45a049',borderWidth: '2px',
                      fontSize: '12px',  
                      minWidth: '90px', 
                      height: '42px',  }} onClick={() => setVaccinated (!vaccinated)}>
                     {vaccinated ? "Unvaccinated" : "Vaccinated"}
                  </Button>
                  
                  <Button variant="contained" 
                  sx={{backgroundColor: "#4CAF50",  fontSize: '12px',height: '42px',ml:'10px', "&:hover": { backgroundColor: "#45a049",}}} >
                    ADD
                  </Button>
                 
                </div>
                                

                <div className="flex bg-white p-2 m-5 overflow-auto rounded-lg">
                        <table class="table-auto w-full border-collapse rounded-lg overflow-hidden">
                            <thead class="bg-gray-100 border-b-2 border-gray-200 rounded-t-lg">
                                <tr>
                                  {vaccinated ? 
                                    Rows1.map((rows, index) => (
                                        <th key={index}
                                            class="p-3 text-sm font-semibold tracking-wide text-center">
                                            {rows.tableHeader}
                                        </th>   
                                    )) :
                                    Rows2.map((rows, index) => (
                                        <th key={index}
                                            class="p-3 text-sm font-semibold tracking-wide text-center">
                                            {rows.tableHeader}
                                        </th>   
                                    ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                  <td></td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            </div>
      </div>
    )
}

export default VaccineTracking;