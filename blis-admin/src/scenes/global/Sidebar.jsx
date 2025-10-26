import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo1.jpg";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleOutlined";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';

const Sidebarr = () => {
  const [open, setOpen] = useState(true);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  const location = useLocation();

  const Menus = [
    { title: "Dashboard", path: "/dashboard", icon: <SpaceDashboardRoundedIcon /> },
    { title: "User Management", path: "/account", icon: <AccountCircleRoundedIcon /> },
    { title: "Raiser/Farmer", path: "/raiserProfile", icon: <PeopleRoundedIcon /> },
    { title: "Livestock", path: "/Ls-inventory", icon: <InventoryRoundedIcon /> },
    { title: "Health and Medical", path: "/healthandmed", icon: <MedicalInformationIcon /> },
    { title: "Inventory and Supplies", path: "/inventorySupplies", icon: <Inventory2RoundedIcon /> },
    { title: "Report and Analytics", path: "/reportsAnalytics", icon: <AssessmentRoundedIcon /> },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-[#2E7D32] h-screen p-5 pt-8 ${
          open ? "w-72" : "w-20"
        } duration-300 relative shadow-lg`}
      >
        {/* Toggle Button */}
        <ArrowBackIosNewRoundedIcon
          sx={{
            fontSize: 28,
            borderRadius: "50%",
            backgroundColor: "white",
            color: "#2E7D32",
            padding: 0.5,
            boxShadow: "0 0 6px rgba(0,0,0,0.2)",
            transition: "0.3s",
          }}
          className={`absolute top-6 -right-4 cursor-pointer ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />

        {/* Logo */}
        <div className="flex justify-center mb-3 mt-8">
          <img
            src={logo}
            className={`${
              open ? "w-20 h-20" : "w-10 h-10 mt-2"
            } rounded-xl transition-all duration-300`}
            alt="logo"
          />
        </div>

        {/* Title */}
        <h1
          className={`text-white text-center font-semibold text-lg tracking-wide mb-6 transition-all duration-300 ${
            !open && "opacity-0 scale-0"
          }`}
        >
          BANTAY LIVESTOCK
        </h1>

        {/* Menu List */}
        <ul className="space-y-1">
          {Menus.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <div key={index}>
                {/* Main Item */}
                <li
                  className={`flex items-center gap-x-3 p-2 rounded-md cursor-pointer transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#33ab39] text-white"
                      : "text-white hover:bg-[#4CAF50]/60"
                  }`}
                  onClick={() => {
                    if (menu.submenu) {
                      setSubmenuOpen(
                        submenuOpen === menu.title ? null : menu.title
                      );
                    }
                  }}
                >
                  <span className="text-lg">{menu.icon}</span>

                  <Link
                    to={menu.path}
                    className={`flex-1 text-base font-medium duration-300 ${
                      !open && "hidden"
                    }`}
                  >
                    {menu.title}
                  </Link>

                  {menu.submenu && open && (
                    <KeyboardArrowDownRoundedIcon
                      className={`transition-transform duration-300 ${
                        submenuOpen === menu.title ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </li>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebarr;
