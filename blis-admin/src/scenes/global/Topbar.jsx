import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const [readIds, setReadIds] = useState(new Set());

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "users", user.uid, "notifications"),
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

    return () => unsub();
  }, [user?.uid]);

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const isRead = (id) => readIds.has(id);

  const markAsRead = async (id) => {
    await updateDoc(doc(db, "users", user.uid, "notifications", id), {
      read: true,
    });
  };

  const markAllAsRead = useCallback(async () => {
    if (!user?.uid) return;

    const batch = writeBatch(db);

    notifications
      .filter((n) => !n.read)
      .forEach((n) => {
        batch.update(doc(db, "users", user.uid, "notifications", n.id), {
          read: true,
        });
      });

    await batch.commit();
  }, [notifications, user?.uid]);

  useEffect(() => {
    if (openNotifications) {
      markAllAsRead();
    }
  }, [openNotifications, markAllAsRead]);

  // const notificationsQuery = useMemo(() => {
  //   if (!user?.uid) return null;

  //   return query(
  //     collection(db, "notifications"),
  //     where("userId", "==", user.uid),
  //     orderBy("createdAt", "desc")
  //   );
  // }, [user?.uid]);

  // useEffect(() => {
  //   if (!notificationsQuery) return;

  //   let active = true;

  //   const unsub = onSnapshot(notificationsQuery, (snap) => {
  //     if (!active) return;

  //     const data = snap.docs.map((d) => ({
  //       id: d.id,
  //       ...d.data(),
  //     }));

  //     setNotifications(data);
  //     setUnreadCount(data.filter((n) => !n.read).length);
  //   });

  //   return () => {
  //     active = false;
  //     unsub();
  //   };
  // }, [notificationsQuery]);

  // const markAsRead = async (id) => {
  //   await updateDoc(doc(db, "notifications", id), { read: true });
  // };

  // const markAllAsRead = async () => {
  //   const batch = writeBatch(db);

  //   notifications
  //     .filter((n) => !n.read)
  //     .forEach((n) =>
  //       batch.update(doc(db, "notifications", n.id), { read: true })
  //     );

  //   await batch.commit();
  // };

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-2 py-3 bg-white border-b z-50">
      {/* Left title */}
      <p className="text-xl font-semibold text-gray-800 leading-none">
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
          <div
            className="
      absolute right-0 top-12 w-96 bg-white border
      shadow-xl rounded-xl z-50
      transform transition-all duration-150
      opacity-100 scale-100
    "
            role="menu"
            aria-label="Notifications"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">Notifications</p>

                {unreadCount > 0 && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <ul
              className="max-h-96 overflow-y-auto divide-y"
              aria-live="polite"
            >
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  <p className="font-medium">You’re all caught up 🎉</p>
                  <p className="mt-1 text-xs">
                    New notifications will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`
              relative px-4 py-3 cursor-pointer
              ${!n.read ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}
            `}
                    role="menuitem"
                  >
                    {/* Unread indicator */}
                    {!n.read && (
                      <span className="absolute left-3 top-4 h-2 w-2 rounded-full bg-blue-600" />
                    )}

                    <div className="pl-4">
                      <p className="font-medium text-sm text-gray-800">
                        {n.title}
                      </p>

                      <p className="text-xs text-gray-600 mt-0.5">
                        {n.message}
                      </p>

                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>
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
