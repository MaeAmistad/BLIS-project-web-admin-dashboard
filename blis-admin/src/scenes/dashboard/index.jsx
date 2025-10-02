import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";


const Dashboard = () => {

    return  (
        <div className="flex bg-[#F5F5F5]" >
            <Sidebarr/>
            <div className="w-full">
                <Topbar/>

                <div className="flex justify-between items-center">
                    <Header title="DASHBOARD" subtitle="Welcome to your dashboard"/>
                </div>
                

                
            </div>
            
        </div>

    )
}

export default Dashboard;