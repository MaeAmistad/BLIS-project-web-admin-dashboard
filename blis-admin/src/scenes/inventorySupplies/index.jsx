import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";

const InventoryandSupplies = () => {

  const Rows = [
        {tableHeader:"Date of Visit"},
        {tableHeader:"Farmer's Name"},
        {tableHeader:"Address"},
        {tableHeader:"Species"},
        {tableHeader:"Age/Age Group"},
        {tableHeader:"Population"},
        {tableHeader:"Cases"},
        {tableHeader:"Deaths"},
        {tableHeader:"Clinical Sign"},
        {tableHeader:"Other Informations"},
    ]  

    return (
      <div className="flex bg-[#F5F5F5]">
        <Sidebarr/>
            <div className="w-full">
                <Topbar/>

                 <div className="flex justify-between items-center">
                    <Header title="Inventory and Supplies"/>
                </div>

                <div className="flex bg-white p-2 m-5 overflow-auto rounded-lg">
                    <div className="w-full">
                        <table class="table-auto w-full border-collapse rounded-lg overflow-hidden">
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

export default InventoryandSupplies;