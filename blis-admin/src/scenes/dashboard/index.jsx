import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";

const Dashboard = () => {

    return  (
        <div className="flex">
            <Sidebarr/>
            <Topbar/>
        </div>
    )
}

export default Dashboard;