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

const renderCustomizedLabel = ({ x, y, name, percentage }) => {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="#374151"
    >
      <tspan x={x} fontSize="10" fontWeight="600">
        {name}
      </tspan>
      <tspan x={x} dy="1.1em" fontSize="9" fill="#6B7280">
        {percentage}%
      </tspan>
    </text>
  );
};

const LivestockPieChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        dataKey="count"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={90}
        label={renderCustomizedLabel}
        labelLine={false}
      >
        {data.map((_, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip
        cursor={false}
        contentStyle={{
          border: "none",
          boxShadow: "none",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "6px 8px",
        }}
        itemStyle={{
          fontSize: "12px",
          color: "#374151",
        }}
      />
    </PieChart>
  </ResponsiveContainer>
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`rounded-xl shadow p-3 border-2 ${color} w-full`}>
    <div className="flex justify-between items-center">
      <p className="text-md opacity-90">{title}</p>
      <Icon className="w-5 text-md h-5 opacity-80" />
    </div>
    <h2 className="text-2xl font-bold mt-1">{value}</h2>
  </div>
);

const ActivityLog = ({ reminders, loadingReminders }) => {
  const navigate = useNavigate();

  const handleClick = (reminder) => {
    if (reminder.type === "low-stock" || reminder.type === "expiration") {
      navigate("/inventorySupplies");
    } else {
      navigate("/healthandmed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-300 flex flex-col h-full">
      <h3 className="font-semibold text-md mb-4 flex items-center gap-2 bg-gray-700 text-white rounded-lg p-1">
        <Activity size={14} /> Reminders
      </h3>

      <div className="flex-1 overflow-y-auto">
        {loadingReminders ? (
          <p className="text-xs text-gray-500 animate-pulse">
            Loading reminders...
          </p>
        ) : reminders.length === 0 ? (
          <p className="text-xs text-gray-500">No reminders</p>
        ) : (
          <ul className="space-y-4 text-xs">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                onClick={() => handleClick(reminder)}
                role="button"
                className={`border-l-4 pl-3 text-sm cursor-pointer hover:bg-gray-100 transition ${
                  reminder.type === "low-stock"
                    ? "border-red-500"
                    : reminder.type === "expiration" &&
                        reminder.remainingDays <= 3
                      ? "border-red-500"
                      : reminder.type === "expiration" &&
                          reminder.remainingDays <= 7
                        ? "border-yellow-500"
                        : "border-blue-500"
                }`}
              >
                <p className="text-xs text-gray-500 font-semibold">
                  <span>
                    {reminder.date?.toLocaleDateString() || "No date"}
                  </span>

                  {typeof reminder.remainingDays === "number" && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded-full text-[10px]
                        ${
                          reminder.remainingDays <= 3
                            ? "bg-red-100 text-red-600"
                            : reminder.remainingDays <= 7
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                    >
                      {reminder.remainingDays === 0
                        ? "Today"
                        : `${reminder.remainingDays} days left`}
                    </span>
                  )}
                </p>

                <p
                  className={`font-medium mt-2 ${
                    reminder.type === "low-stock"
                      ? "text-red-600"
                      : reminder.type === "expiration" &&
                          reminder.remainingDays <= 3
                        ? "text-red-600"
                        : reminder.type === "expiration" &&
                            reminder.remainingDays <= 7
                          ? "text-yellow-600"
                          : ""
                  }`}
                >
                  {reminder.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
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
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 gap-3 h-full">
                    <StatCard
                      title="Total Raisers"
                      value={stats.raisers}
                      icon={Users}
                      color="border border-primary border-4"
                    />
                    <StatCard
                      title="Total Livestocks"
                      value={stats.livestock}
                      icon={Beef}
                      color="border border-primary border-4"
                    />
                    <StatCard
                      title="Inventory Items"
                      value={stats.inventoryItems}
                      icon={Boxes}
                      color="border border-primary border-4"
                    />
                    <StatCard
                      title="Total Accounts"
                      value={stats.activeUsers}
                      icon={Users}
                      color="border border-primary border-4"
                    />
                  </div>

                  {/* Pie chart */}
                  {!loadingDashboard && livestockByType.length > 0 && (
                    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200 flex flex-col items-center">
                      <h3 className="font-semibold mb-1 text-center text-sm">
                        Livestock Distribution by Type
                      </h3>
                      <div className="w-full">
                        <LivestockPieChart data={livestockByType} />
                      </div>
                    </div>
                  )}
                </div>

                {/* ACTIVITY LOG + CALENDAR */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow p-4 min-h-[280px]">
                    <ActivityLog
                      reminders={reminders}
                      loading={loadingReminders}
                    />
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-200 shadow p-4 min-h-[280px]">
                    <CalendarPanel />
                  </div>
                </div>

                {/* LINE CHART — full width */}
                <div className="bg-white rounded-2xl shadow p-4 border border-gray-200">
                  <h3 className="font-semibold mb-3">
                    Active Raisers per Barangay
                  </h3>
                  <div className="w-full h-[260px]">
                    {raisersByAddress.length === 0 ? (
                      <EmptyChartState message="No raisers data available yet" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={raisersByAddress}
                          margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="address"
                            angle={-30}
                            textAnchor="end"
                            interval={0}
                            height={60}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            allowDecimals={false}
                            domain={[0, "auto"]}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip contentStyle={{ fontSize: "12px" }} />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#2563eb"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="px-4 m-1 mt-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
            {loadingDashboard ? (
              <p className="mt-6 item-center text-center">
                Loading dashboard...
              </p>
            ) : (
              <>
          
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6 items-stretch min-h-[200px]">
        
                  <div className="xl:col-span-4 flex flex-col gap-4 h-full">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 auto-rows-fr">
                      <StatCard
                        title="Total Raisers"
                        value={stats.raisers}
                        icon={Users}
                        color="border border-primary"
                      />
                      <StatCard
                        title="Total Livestocks"
                        value={stats.livestock}
                        icon={Beef}
                        color="border border-primary"
                      />
                      <StatCard
                        title="Inventory Items"
                        value={stats.inventoryItems}
                        icon={Boxes}
                        color="border border-primary"
                      />
                       <StatCard
                        title="Total Accounts"
                        value={stats.activeUsers}
                        icon={Users}
                        color="border border-primary"
                      />

                    </div>
                  </div>

     
                  <div className="xl:col-span-7 h-full grid grid-cols-1 xl:grid-cols-2 gap-4 auto-rows-fr h-full">

                    <div className="h-[300px]">
                      <ActivityLog reminders={reminders} loading={loadingReminders}/>
                    </div>

    
                    <div className="h-[300px] flex flex-col">
                      <CalendarPanel />
                    </div>
                  </div>
                </div>


                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
                  <div className="xl:col-span-8 bg-white rounded-2xl shadow p-4 border border-gray-200">
                    <h3 className="font-semibold mb-3">Active Raisers per Barangay</h3>

                    <div className="w-full h-[260px]">
                      {raisersByAddress.length === 0 ? (
                        <EmptyChartState message="No raisers data available yet" />
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={raisersByAddress}
                            margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="address"
                              angle={-30}
                              textAnchor="end"
                              interval={0}
                              height={60}
                              tick={{ fontSize: 12 }}
                            />
                            <YAxis
                              allowDecimals={false}
                              domain={[0, "auto"]}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              contentStyle={{ fontSize: "12px" }}
                              labelStyle={{ fontSize: "12px" }}
                            />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#2563eb"
                              strokeWidth={3}
                              dot={{ r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

      
                  {!loadingDashboard && livestockByType.length > 0 && (
                    <div className="xl:col-span-4 bg-white rounded-2xl shadow p-4 flex flex-col border border-gray-200">
                      <h3 className="font-semibold mb-3 text-center text-sm">
                        Livestock Distribution by Type
                      </h3>

                      <div className="flex-1 w-full">
                        <LivestockPieChart data={livestockByType} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
