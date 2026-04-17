import { useEffect, useState } from "react";
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
  onSnapshot,
  limit,
  orderBy,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import Headerr from "../../components/Headerr";
import { useAuth } from "../../components/AuthContext";

import {
  Users,
  Beef,
  Syringe,
  Boxes,
  AlertTriangle,
  Activity,
  Droplets,
  UsersRound,
  Dog,
} from "lucide-react";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
  LineChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CalendarPanel from "../../components/CalendarPanel";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#316ccb",
  "#10B981",
  "#0b74f5b0",
  "#9c0d6a",
  "#068865",
  "#06B6D4",
  "#F97316",
];
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const RADIAN = Math.PI / 180;

 
  const radius = outerRadius + 10;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={11}
      fontWeight="600"
    >
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const LivestockPieChart = ({ data }) => (
  <div className="flex items-center justify-center gap-6">
    <div className="flex justify-center items-center">
      <ResponsiveContainer width={230} height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={true}
            label={renderCustomizedLabel}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              border: "none",
              boxShadow: "none",
              backgroundColor: "rgba(255,255,255,0.95)",
              padding: "6px 8px",
            }}
            itemStyle={{ fontSize: "10px", color: "#374151" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-col gap-2 items-center justify-center">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 w-40 justify-between"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />

            <span className="text-xs font-medium text-gray-700">
              {item.name}
            </span>
          </div>

          <span className="text-xs font-semibold text-gray-800">
            {item.count}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const StatCard = ({
  title,
  value,
  icon: Icon,
  weeklyAdded = 0,
  weeklyDeleted = 0,
}) => (
  <div className="bg-white rounded-xl shadow p-4 border border-green-600 border-4 flex items-center gap-4 w-full">
    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div className="flex-1">
      <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
        {value}
      </h2>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
        ↑ +{weeklyAdded}{" "}
        <span className="font-normal text-green-600">this week</span>
      </span>
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
        ↓ −{weeklyDeleted}{" "}
        <span className="font-normal text-red-600">this week</span>
      </span>
    </div>
  </div>
);

const ActivityLog = ({ reminders, loadingReminders }) => {
  const navigate = useNavigate();
  const handleClick = (reminder) => {
    if (reminder.type === "low-stock" || reminder.type === "expiration")
      navigate("/inventorySupplies");
    else navigate("/healthandmed");
  };
  const borderColor = (r) =>
    r.type === "low-stock"
      ? "border-red-500"
      : r.type === "expiration" && r.remainingDays <= 3
        ? "border-red-500"
        : r.type === "expiration" && r.remainingDays <= 7
          ? "border-yellow-500"
          : "border-blue-500";
  const dotColor = (r) =>
    r.type === "low-stock"
      ? "bg-red-500"
      : r.type === "expiration" && r.remainingDays <= 3
        ? "bg-red-500"
        : r.type === "expiration" && r.remainingDays <= 7
          ? "bg-yellow-500"
          : "bg-blue-500";

  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <span className="w-1 h-4 bg-blue-600 rounded-sm inline-block" />
          Reminders
        </h3>
        <button className="text-[11px] text-blue-600 flex items-center gap-1">
          ↑ See all ›
        </button>
      </div>

      {loadingReminders ? (
        <p className="text-xs text-gray-400 animate-pulse">
          Loading reminders...
        </p>
      ) : reminders.length === 0 ? (
        <p className="text-xs text-gray-400">No reminders</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              onClick={() => handleClick(reminder)}
              role="button"
              className={`flex items-start gap-2 p-3 rounded-lg bg-gray-50 border-l-4 cursor-pointer hover:bg-gray-100 transition ${borderColor(reminder)}`}
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${dotColor(reminder)}`}
              />
              <div>
                <p className="text-[10px] text-gray-400 font-medium">
                  {reminder.date?.toLocaleDateString() || "No date"}
                  {typeof reminder.remainingDays === "number" && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                        reminder.remainingDays <= 3
                          ? "bg-red-100 text-red-600"
                          : reminder.remainingDays <= 7
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {reminder.remainingDays === 0
                        ? "Today"
                        : `${reminder.remainingDays}d left`}
                    </span>
                  )}
                </p>
                <p className="text-xs font-medium text-gray-800 mt-1 leading-snug">
                  {reminder.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyChartState = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400">
    <LineChartIcon className="w-10 h-10 mb-3 opacity-50" />
    <p className="text-xs">{message}</p>
  </div>
);

function isToday(timestamp) {
  if (!timestamp) return false;
  const date = timestamp.toDate?.() || new Date(timestamp);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    raisers: 0,
    livestock: 0,
    activeUsers: 0,
    vaccinations: 0,
    deworming: 0,
    treatments: 0,
    aiPending: 0,
    inventoryItems: 0,
    lowStock: 0,
    unvaccinated: 0,
  });

  const [weeklyStats, setWeeklyStats] = useState({
    raisersAdded: 0,
    raisersDeleted: 0,
    livestockAdded: 0,
    livestockDeleted: 0,
    inventoryAdded: 0,
    inventoryDeleted: 0,
    usersAdded: 0,
    usersDeleted: 0,
  });

  const [raisersByAddress, setRaisersByAddress] = useState([]);
  const [livestockByType, setLivestockByType] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingReminders, setLoadingReminders] = useState(true);

  const [reminders, setReminders] = useState([]);

  const addMonths = (date, months) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  };

  const getRemainingDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    const fetchReminders = async () => {
      setLoadingReminders(true);
      try {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const parseDateString = (dateStr) => {
          if (!dateStr || typeof dateStr !== "string") return null;
          const d = new Date(dateStr.replace(/\//g, "-"));
          return isNaN(d.getTime()) ? null : d;
        };

        const reminderList = [];

        const inventorySnap = await getDocs(collection(db, "inventories"));

        inventorySnap.forEach((doc) => {
          const { itemName, quantity, expirationDate } = doc.data();

          if (quantity <= 10) {
            reminderList.push({
              type: "low-stock",
              message: `Low Stock Alert for ${itemName} (Qty: ${quantity})`,
              date: new Date(),
            });
          }

          if (expirationDate) {
            const expDate = parseDateString(expirationDate);
            if (
              expDate &&
              expDate.getMonth() === currentMonth &&
              expDate.getFullYear() === currentYear
            ) {
              reminderList.push({
                type: "expiration",
                message: `Expiration Date for ${itemName} is coming`,
                date: expDate,
              });
            }
          }
        });

        const raisersSnap = await getDocs(collection(db, "raisers"));

        for (const raiserDoc of raisersSnap.docs) {
          const raiserData = raiserDoc.data();
          const fullName = `${raiserData.firstName} ${raiserData.lastName}`;

          const livestockSnap = await getDocs(
            collection(db, "raisers", raiserDoc.id, "livestock"),
          );

          for (const livestockDoc of livestockSnap.docs) {
            const livestockData = livestockDoc.data();
            const { typeOfAnimal } = livestockData;

            const animalType = typeOfAnimal?.toUpperCase();

            if (!animalType || animalType === "DOG" || animalType === "CAT")
              continue;

            const healthSnap = await getDocs(
              collection(
                db,
                "raisers",
                raiserDoc.id,
                "livestock",
                livestockDoc.id,
                "healthRecords",
              ),
            );

            healthSnap.forEach((healthDoc) => {
              const healthData = healthDoc.data();
              const recordType = healthData.type?.toUpperCase();

              // DEWORMING
              if (recordType === "DEWORMING" && healthData.dateAdministered) {
                const administeredDate = parseDateString(
                  healthData.dateAdministered,
                );
                const nextDeworming = addMonths(administeredDate, 3);

                if (
                  nextDeworming.getMonth() === currentMonth &&
                  nextDeworming.getFullYear() === currentYear
                ) {
                  reminderList.push({
                    type: "deworming",
                    message: `Next Deworming Schedule for ${typeOfAnimal} of ${fullName}`,
                    date: nextDeworming,
                  });
                }
              }

              // AI
              if (recordType === "AI") {
                const calvingDate = parseDateString(healthData.calvingDate);
                if (
                  calvingDate &&
                  calvingDate.getMonth() === currentMonth &&
                  calvingDate.getFullYear() === currentYear
                ) {
                  reminderList.push({
                    type: "ai-reheat",
                    message: `Reheat Monitoring of the ${typeOfAnimal} of ${fullName}`,
                    date: calvingDate,
                  });
                }

                const expectedDelivery = parseDateString(
                  healthData.expectedDelivery,
                );
                if (
                  expectedDelivery &&
                  expectedDelivery.getMonth() === currentMonth &&
                  expectedDelivery.getFullYear() === currentYear
                ) {
                  reminderList.push({
                    type: "ai-delivery",
                    message: `Expected Delivery of the ${typeOfAnimal} of ${fullName}`,
                    date: expectedDelivery,
                  });
                }
              }
            });
          }
        }

        reminderList.sort((a, b) => a.date - b.date);

        setReminders(reminderList);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      } finally {
        setLoadingReminders(false);
      }
    };

    fetchReminders();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "activityLogs"),
      orderBy("createdAt", "desc"),
      limit(10),
    );

    onSnapshot(q, (snapshot) => {
      setActivityLogs(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    });

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setActivityLogs(logs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const raisersSnap = await getDocs(collection(db, "raisers"));
        const addressMap = {};
        raisersSnap.forEach((doc) => {
          const { address } = doc.data();
          addressMap[address] = (addressMap[address] || 0) + 1;
        });

        setRaisersByAddress(
          Object.entries(addressMap).map(([address, count]) => ({
            address,
            count,
          })),
        );

        const livestockSnap = await getDocs(collectionGroup(db, "livestock"));
        const healthSnap = await getDocs(collectionGroup(db, "healthRecords"));
        const animalMap = {};

        const vaccinatedLivestockIds = new Set();

        livestockSnap.forEach((doc) => {
          const { typeOfAnimal } = doc.data();
          if (!typeOfAnimal) return;

          const key = typeOfAnimal.toUpperCase();
          animalMap[key] = (animalMap[key] || 0) + 1;
        });

        const totalLivestock = livestockSnap.size;

        const livestockTypeData = Object.entries(animalMap).map(
          ([type, count]) => ({
            name: type,
            count,
            percentage: ((count / totalLivestock) * 100).toFixed(1),
          }),
        );

        setLivestockByType(livestockTypeData);

        const activeUsersSnap = await getDocs(
          query(collection(db, "users"), where("status", "==", "ACTIVE")),
        );

        let vaccinationCount = 0;
        let treatmentCount = 0;
        let aiPendingCount = 0;
        let dewormingCount = 0;

        healthSnap.forEach((doc) => {
          const data = doc.data();
          const type = data.type?.toUpperCase?.();

          if (!type) return;

          if (type === "VACCINATIONS" || type === "VACCINATION") {
            vaccinationCount++;
            if (doc.ref.parent?.parent?.id) {
              vaccinatedLivestockIds.add(doc.ref.parent.parent.id);
            }
          }

          if (type === "TREATMENT") treatmentCount++;
          if (type === "AI") aiPendingCount++;
          if (type === "DEWORMING") dewormingCount++;
        });

        let unvaccinatedCount = 0;

        livestockSnap.forEach((doc) => {
          const { typeOfAnimal } = doc.data();
          if (!typeOfAnimal) return;

          const key = typeOfAnimal.toUpperCase();

          if (
            (key === "DOG" || key === "CAT") &&
            !vaccinatedLivestockIds.has(doc.id)
          ) {
            unvaccinatedCount++;
          }
        });

        const inventorySnap = await getDocs(collection(db, "inventories"));
        let lowStockCount = 0;

        inventorySnap.forEach((doc) => {
          const item = doc.data();
          if (item.quantity <= item.threshold) lowStockCount++;
        });

        setStats({
          raisers: raisersSnap.size,
          livestock: livestockSnap.size,
          activeUsers: activeUsersSnap.size,
          vaccinations: vaccinationCount,
          treatments: treatmentCount,
          aiPending: aiPendingCount,
          deworming: dewormingCount,
          inventoryItems: inventorySnap.size,
          lowStock: lowStockCount,
          unvaccinated: unvaccinatedCount,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const isThisWeek = (timestamp) => {
        if (!timestamp) return false;
        const date = timestamp.toDate?.() || new Date(timestamp);
        return date >= startOfWeek;
      };

      try {
        const raisersSnap = await getDocs(collection(db, "raisers"));
        let raisersAdded = 0,
          raisersDeleted = 0;
        raisersSnap.forEach((doc) => {
          const data = doc.data();
          if (isThisWeek(data.createdAt)) raisersAdded++;
          if (data.deletedAt && isThisWeek(data.deletedAt)) raisersDeleted++;
        });

        const livestockSnap = await getDocs(collectionGroup(db, "livestock"));
        let livestockAdded = 0,
          livestockDeleted = 0;
        livestockSnap.forEach((doc) => {
          const data = doc.data();
          if (isThisWeek(data.createdAt)) livestockAdded++;
          if (data.deletedAt && isThisWeek(data.deletedAt)) livestockDeleted++;
        });

        const inventorySnap = await getDocs(collection(db, "inventories"));
        let inventoryAdded = 0,
          inventoryDeleted = 0;
        inventorySnap.forEach((doc) => {
          const data = doc.data();
          if (isThisWeek(data.createdAt)) inventoryAdded++;
          if (data.deletedAt && isThisWeek(data.deletedAt)) inventoryDeleted++;
        });

        const usersSnap = await getDocs(
          query(collection(db, "users"), where("status", "==", "ACTIVE")),
        );
        let usersAdded = 0,
          usersDeleted = 0;
        usersSnap.forEach((doc) => {
          const data = doc.data();
          if (isThisWeek(data.createdAt)) usersAdded++;
          if (data.deletedAt && isThisWeek(data.deletedAt)) usersDeleted++;
        });

        setWeeklyStats({
          raisersAdded,
          raisersDeleted,
          livestockAdded,
          livestockDeleted,
          inventoryAdded,
          inventoryDeleted,
          usersAdded,
          usersDeleted,
        });
      } catch (error) {
        console.error("Weekly stats error:", error);
      }
    };

    fetchWeeklyStats();
  }, []);

  useEffect(() => {
    console.log("raisersByAddress:", raisersByAddress);

    if (raisersByAddress.length === 0) {
      console.warn("raisersByAddress is empty");
    } else {
      raisersByAddress.forEach((item, index) => {
        console.log(
          `#${index + 1}`,
          "Address:",
          item.address,
          "Count:",
          item.count,
        );
      });
    }
  }, [raisersByAddress]);

  function mergeAndSort(prevLogs, newLogs) {
    const allLogs = [...prevLogs, ...newLogs];
    allLogs.sort((a, b) => {
      const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
      const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
      return bTime - aTime;
    });

    const filteredLogs = allLogs.filter((log) => isToday(log.createdAt));
    setActivityLogs(filteredLogs);

    return allLogs.slice(0, 20);
  }
  useEffect(() => {
    const raiserQuery = query(
      collection(db, "raisers"),
      orderBy("createdAt", "desc"),
      limit(20),
    );

    const unsubscribeRaisers = onSnapshot(raiserQuery, (snapshot) => {
      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        message: `Raiser added: ${doc.data().firstName + " " + doc.data().lastName}`,
        createdAt: doc.data().createdAt,
      }));
      setActivityLogs((prev) => mergeAndSort(prev, logs));
    });

    const healthQuery = query(
      collectionGroup(db, "healthRecords"),
      orderBy("createdAt", "desc"),
      limit(20),
    );

    const unsubscribeHealth = onSnapshot(healthQuery, (snapshot) => {
      const logs = snapshot.docs.map((doc) => ({
        id: doc.id,
        message: `Health record added for ${doc.data().livestockName || "unknown"}`,
        createdAt: doc.data().createdAt,
      }));
      setActivityLogs((prev) => mergeAndSort(prev, logs));
    });

    return () => {
      unsubscribeRaisers();
      unsubscribeHealth();
    };
  }, []);
  return (
    <div className="app flex flex-col md:flex-row">
      <Sidebarr />

      <div className="content flex-grow overflow-auto h-screen">
        <Topbar />

        <div>
          <div className="top-14 flex flex-col md:flex-row items-start md:items-center justify-between p-1 m-2">
            <Headerr
              title="Dashboard"
              subtitle={`Welcome, ${user?.role} ${user?.name}`}
            />
          </div>
          <div className="px-4 m-1 mt-1 flex-grow overflow-y-auto bg-white shadow-md rounded-md">
            {loadingDashboard ? (
              <p className="mt-6 text-center">Loading dashboard...</p>
            ) : (
              <div className="py-4 space-y-5">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <StatCard
                    title="Total Raisers"
                    value={stats.raisers}
                    icon={UsersRound}
                    weeklyAdded={weeklyStats.raisersAdded}
                    weeklyDeleted={weeklyStats.raisersDeleted}
                  />
                  <StatCard
                    title="Total Livestocks"
                    value={stats.livestock}
                    icon={Dog}
                    weeklyAdded={weeklyStats.livestockAdded}
                    weeklyDeleted={weeklyStats.livestockDeleted}
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <StatCard
                    title="Inventory Items"
                    value={stats.inventoryItems}
                    icon={Boxes}
                    weeklyAdded={weeklyStats.inventoryAdded}
                    weeklyDeleted={weeklyStats.inventoryDeleted}
                  />
                  <StatCard
                    title="Total Accounts"
                    value={stats.activeUsers}
                    icon={Users}
                    weeklyAdded={weeklyStats.usersAdded}
                    weeklyDeleted={weeklyStats.usersDeleted}
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {!loadingDashboard && livestockByType.length > 0 && (
                    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
                      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                        <span className="w-1 h-4 bg-blue-600 rounded-sm inline-block" />
                        Livestock Distribution{" "}
                        <span className="font-normal text-gray-400 text-xs">
                          by type
                        </span>
                      </h3>
                      <LivestockPieChart data={livestockByType} />
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-gray-200 shadow p-4 min-h-[280px]">
                    <CalendarPanel />
                  </div>
                </div>

                <ActivityLog
                  reminders={reminders}
                  loadingReminders={loadingReminders}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
