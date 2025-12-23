import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import Headerr from "../../components/Headerr";
import { useAuth } from "../../components/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />
      <div className="content flex-grow p-2 overflow-auto h-screen">
        <Topbar />

        <div className="p-4">
          <div className="flex justify-between items-center">
            <Headerr
              title="Dashboard"
              subtitle={`Welcome, ${user?.role} ${user?.name} `}
            />
          </div>
        </div>

        {/* <div className="m-1 mt-1 flex-grow h-full bg-white-main shadow-md rounded-md">
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
