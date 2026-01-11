import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { Bell } from "lucide-react";
import { useAuth } from "../../components/AuthContext";

import { doc, updateDoc } from "firebase/firestore";

const settings = [{ title: "User Profile", path: "/userprofile" }];

const Topbar = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openNotifications, setOpenNotifications] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
    });

    return unsub;
  }, [user?.uid]);

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  const markAllAsRead = async () => {
    const batch = writeBatch(db);

    notifications
      .filter((n) => !n.read)
      .forEach((n) =>
        batch.update(doc(db, "notifications", n.id), { read: true })
      );

    await batch.commit();
  };

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
          onClick={() => setOpenNotifications(!openNotifications)}
          className="relative flex items-center justify-center p-2 border rounded-md hover:bg-gray-100"
        >
          <Bell className="h-5 w-5 text-gray-700" />

          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-white
                     text-xs font-bold rounded-full px-1.5"
            >
              {unreadCount}
            </span>
          )}
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

        {openNotifications && (
          <div className="absolute right-0 top-12 w-96 bg-white shadow-lg rounded-xl border z-50">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <p className="font-semibold">Notifications</p>
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <ul className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`px-4 py-3 cursor-pointer border-b
              ${!n.read ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}
            `}
                  >
                    <p className="font-medium text-sm">{n.title}</p>
                    <p className="text-xs text-gray-600">{n.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {n.createdAt?.toDate().toLocaleString()}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

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
