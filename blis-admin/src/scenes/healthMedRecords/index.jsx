import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";

const HealthandMedical = () => {

    return (
      <div className="flex bg-[#F5F5F5]">
        <Sidebarr/>
            <div className="w-full">
                <Topbar/>

                 <div className="flex justify-between items-center">
                    <Header title="Health and Medical Records"/>
                </div>             
            </div>
      </div>
    )
}

export default HealthandMedical;