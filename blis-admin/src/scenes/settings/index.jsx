import Header from "../../components/header";
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";

const Settings = () => {

    return (
        <div className="flex bg-[#F5F5F5] min-h-screen">
            <Sidebarr />
            <div className="w-full">
                <Topbar />
                <div className="flex justify-between items-center">
                <Header title="Settings" />
                </div>

            </div>
        </div>
    )
}

export default Settings;