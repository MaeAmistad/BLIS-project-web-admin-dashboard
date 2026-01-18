import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo1.jpg";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleOutlined";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { getAuth, signOut } from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Sidebarr = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const navigate = useNavigate();
  const auth = getAuth();

  const Menus = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: <SpaceDashboardRoundedIcon />,
    },
    {
      title: "Account Management",
      path: "/account",
      icon: <AccountCircleRoundedIcon />,
    },
    {
      title: "Raiser/Farmer",
      path: "/raiserProfile",
      icon: <PeopleRoundedIcon />,
    },
    {
      title: "Livestock",
      path: "/livestock",
      icon: <InventoryRoundedIcon />,
    },
    {
      title: "Health and Medical",
      path: "/healthandmed",
      icon: <MedicalInformationIcon />,
    },
    {
      title: "Inventory and Supplies",
      path: "/inventorySupplies",
      icon: <Inventory2RoundedIcon />,
    },
    // {
    //   title: "Report and Analytics",
    //   path: "/reportsAnalytics",
    //   icon: <AssessmentRoundedIcon />,
    // },
    // { title: "Settings", path: "/settings", icon: <SettingsRoundedIcon /> },
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await signOut(auth);

      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been logged out successfully.",
        timer: 1200,
        showConfirmButton: false,
      });

      navigate("/", { replace: true });
    }
  };

  return (
    <div
      className={`bg-[#2E7D32] h-screen p-2 pt-5 ${
        open ? "w-64" : "w-20"
      } duration-300 relative shadow-lg`}
    >
      {/* Logo */}
      <div className="flex flex-col items-center pt-2">
        <img
          src={logo}
          alt="logo"
          className={`rounded-xl transition-all duration-300
          ${open ? "w-20 h-20" : "w-10 h-10"}`}
        />

        <h1
          className={`text-white font-semibold text-sm mt-2 transition-all duration-300
          ${!open && "opacity-0 scale-0"}`}
        >
          BANTAY LIVESTOCK
        </h1>
      </div>

      {/* Menu */}
      <ul className="flex-1 mt-6 overflow-y-auto">
        {Menus.map((menu, index) => {
          const isActive = location.pathname === menu.path;
          return (
            <li key={index}>
              <Link
                to={menu.path}
                className={`flex items-center gap-3 p-3 rounded-lg text-xs font-medium transition-all
                ${
                  isActive
                    ? "bg-[#12961A] text-white shadow"
                    : "text-white hover:bg-[#4CAF50]/60"
                }`}
              >
                <span className="text-sm">{menu.icon}</span>
                <span className={`${!open && "hidden"}`}>{menu.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg font-medium text-white text-xs hover:bg-red-500/70 transition-all w-full"
        >
          <LogoutRoundedIcon />
          <span className={`text-xs ${!open && "hidden"}`}>Log out</span>
        </button>
      </div>

      {/* Toggle Button (BOTTOM) */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 bottom-10 bg-[#2E7D32] 
        text-white rounded-full p-1 shadow-lg hover:scale-105 transition"
      >
        <ArrowBackIosNewRoundedIcon
          className={`${!open && "rotate-180"} transition`}
          fontSize="small"
        />
      </button>
    </div>
  );
};

export default Sidebarr;
