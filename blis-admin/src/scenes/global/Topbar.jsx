import { useState } from "react";
import { Link } from "react-router-dom";

const settings = [{ title: "User Profile", path: "/userprofile" }];

const Topbar = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);

  return (
  <div className="sticky top-0 z-10 flex items-center justify-between px-2 py-3 bg-white border-b">
    
    {/* Left title */}
    <p className="text-xl font-semibold text-gray-600 leading-none">
      Bantay Livestock Information and Registration System
    </p>

    {/* Right actions */}
    <div className="relative flex items-center gap-2">
      
      {/* Notifications */}
      <button
        className="flex items-center justify-center p-2 border border-gray-300 rounded-md
                   hover:bg-gray-100 transition hover:shadow-sm active:scale-95
"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11
               a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5
               m6 0a3 3 0 01-6 0"
          />
        </svg>
      </button>

      {/* User Menu */}
      <button
        onClick={() => setOpenUserMenu(!openUserMenu)}
        className="flex items-center justify-center p-2 border border-gray-300 rounded-md
                   hover:bg-gray-100 transition hover:shadow-sm active:scale-95
"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A9 9 0 1118.88 17.8
               M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {openUserMenu && (
        <div
          className="absolute right-0 top-12 w-48 bg-white
                     border border-gray-200 rounded-md shadow-lg"
        >
          {settings.map((setting) => (
            <Link
              key={setting.path}
              to={setting.path}
              onClick={() => setOpenUserMenu(false)}
              className="block px-4 py-2 text-sm text-gray-700
                         hover:bg-gray-100"
            >
              {setting.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  </div>
);

};

export default Topbar;
