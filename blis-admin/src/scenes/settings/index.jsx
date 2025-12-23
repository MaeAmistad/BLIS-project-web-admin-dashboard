
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import Headerr from "../../components/Headerr";

const Settings = () => {

    return (
        <div className="flex bg-[#F5F5F5] min-h-screen">
            <Sidebarr />
            <div className="w-full">
                <Topbar />
                <div className="flex justify-between items-center">
                <Headerr title="Settings" />
                </div>

            </div>
        </div>
    )
}

export default Settings;