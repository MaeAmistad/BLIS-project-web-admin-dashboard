import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";

const LivestockInventory = () => {

  const Rows = [
        {tableHeader:"ID"},
        {tableHeader:"Full Name"},
        {tableHeader:"Municipal"},
        {tableHeader:"Barangay"},
        {tableHeader:"Farm Size"},
        {tableHeader:"QR"},
    ]  

    return (
      <div className="flex bg-[#F5F5F5]">
        <Sidebarr/>
            <div className="w-full">
                <Topbar/>

                 <div className="flex justify-between items-center">
                    <Header title="Morbidity and Mortality"/>
                </div>

                <div className="flex bg-white p-2 m-5 overflow-auto rounded-lg">
                    <div className="w-full">
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
                               <tr>

                               </tr>
                            </tbody>
                        </table>
                    </div>
                </div>              
            </div>
      </div>
    )
}

export default LivestockInventory;