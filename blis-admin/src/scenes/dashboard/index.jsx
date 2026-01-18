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
  Legend,
} from "recharts";
import Card from "@mui/material/Card";
import CalendarPanel from "../../components/CalendarPanel";

const COLORS = [
  "#316ccb", // blue
  "#10B981", // green
  "#0b74f5b0", // amber
  "#9c0d6a", // red
  "#068865", // purple
  "#06B6D4", // cyan
  "#F97316", // orange
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
  <ResponsiveContainer width="100%" height={300}>
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

      {/* <Legend /> */}
    </PieChart>
  </ResponsiveContainer>
);

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`rounded-xl shadow p-3 text-white ${color}
                max-w-[260px] w-full`}
  >
    <div className="flex justify-between items-center">
      <p className="text-xs opacity-90">{title}</p>
      <Icon className="w-5 h-5 opacity-80" />
    </div>
    <h2 className="text-l font-bold mt-1">{value}</h2>
  </div>
);

const ActivityLog = ({ logs }) => (
  <div className="bg-white rounded-2xl shadow p-4 h-full overflow-y-auto border border-gray-300 flex flex-col">
    <h3 className="font-semibold text-md mb-4 flex items-center gap-2">
      <Activity size={16} /> Recent Activity
    </h3>

    {logs.length === 0 ? (
      <p className="text-xs text-gray-500">No recent activity</p>
    ) : (
      <ul className="space-y-4 text-xs overflow-y-auto">
        {logs.map((log) => {
          const date = log.createdAt?.toDate() || log.updatedAt?.toDate();

          return (
            <li
              key={log.id}
              className="border-l-4 border-blue-500 pl-3 text-sm"
            >
              <p className="font-medium">{log.message}</p>
              <p className="text-xs text-gray-500">
                {date ? date.toLocaleString() : "Just now"}
              </p>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

const AlertsPanel = ({ lowStock, aiPending }) => (
  <div className="bg-white rounded-2xl shadow p-4 border border-gray-300">
    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
      <AlertTriangle size={18} /> Alerts
    </h3>

    <ul className="space-y-2 text-xs">
      {lowStock > 0 ? (
        <li className="text-red-600">
          ⚠ {lowStock} inventory items are low on stock
        </li>
      ) : (
        <li className="text-green-600">Inventory levels are healthy</li>
      )}

      {aiPending > 0 && (
        <li className="text-orange-600">{aiPending} AI records pending</li>
      )}
    </ul>
  </div>
);

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
  });

  const [raisersByAddress, setRaisersByAddress] = useState([]);
  const [livestockByType, setLivestockByType] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        /* =========================
           RAISERS + ADDRESS COUNT
        ========================= */
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

        /* =========================
           LIVESTOCK
        ========================= */
        const livestockSnap = await getDocs(collectionGroup(db, "livestock"));

        const animalMap = {}; // { COW: 10, PIG: 5 }

        livestockSnap.forEach((doc) => {
          const { typeOfAnimal } = doc.data();
          if (!typeOfAnimal) return;

          const key = typeOfAnimal.toUpperCase();
          animalMap[key] = (animalMap[key] || 0) + 1;
        });

        // Convert to array + percentage
        const totalLivestock = livestockSnap.size;

        const livestockTypeData = Object.entries(animalMap).map(
          ([type, count]) => ({
            name: type,
            count,
            percentage: ((count / totalLivestock) * 100).toFixed(1),
          }),
        );

        setLivestockByType(livestockTypeData);

        /* =========================
           USERS
        ========================= */
        const activeUsersSnap = await getDocs(
          query(collection(db, "users"), where("status", "==", "ACTIVE")),
        );

        /* =========================
           HEALTH RECORDS
        ========================= */
        const healthSnap = await getDocs(collectionGroup(db, "healthRecords"));

        let vaccinationCount = 0;
        let treatmentCount = 0;
        let aiPendingCount = 0;
        let dewormingCount = 0;

        healthSnap.forEach((doc) => {
          const data = doc.data();
          const type = data.type?.toUpperCase?.();
          if (!data.type) {
            console.warn("Missing type in doc:", doc.id, data);
          }

          if (typeof type !== "string") return;

          if (type === "VACCINATION") vaccinationCount++;
          if (type === "TREATMENT") treatmentCount++;
          if (type === "AI") aiPendingCount++;
          if (type === "DEWORMING") dewormingCount++;
        });

        /* =========================
           INVENTORY
        ========================= */
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
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
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
      return bTime - aTime; // newest first
    });

    const filteredLogs = allLogs.filter((log) => isToday(log.createdAt));
    setActivityLogs(filteredLogs);

    // Optionally, limit to 20 most recent
    return allLogs.slice(0, 20);
  }
  useEffect(() => {
    // 1️⃣ Top-level "raisers"
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

    // 2️⃣ Subcollection "healthRecords" across all livestock
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

          <div className="px-4 m-1 mt-1 flex-grow overflow-y-auto bg-white-main shadow-md rounded-md">
            {loading ? (
              <p className="mt-6 item-center text-center">
                Loading dashboard...
              </p>
            ) : (
              <>
                {/* ================= MAIN GRID ================= */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6 items-stretch">
                  {/* LEFT CONTENT */}
                  <div className="xl:col-span-6 space-y-4 h-full flex flex-col">
                    {/* ================= KPI CARDS ================= */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 place-items-center">
                      <StatCard
                        title="Total Raisers"
                        value={stats.raisers}
                        icon={Users}
                        color="bg-gradient-to-r from-blue-500 to-blue-600"
                      />
                      <StatCard
                        title="Total Livestock"
                        value={stats.livestock}
                        icon={Beef}
                        color="bg-gradient-to-r from-emerald-600 to-emerald-700"
                      />
                      <StatCard
                        title="Active Users"
                        value={stats.activeUsers}
                        icon={Users}
                        color="bg-gradient-to-r from-indigo-900 to-indigo-950"
                      />
                      <StatCard
                        title="Inventory Items"
                        value={stats.inventoryItems}
                        icon={Boxes}
                        color="bg-gradient-to-r from-teal-600 to-teal-700"
                      />
                    </div>

                    {/* HEALTH OVERVIEW */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 place-items-center">
                      <StatCard
                        title="Vaccinations"
                        value={stats.vaccinations}
                        icon={Syringe}
                        color="bg-gradient-to-r from-emerald-500 to-emerald-600"
                      />
                      <StatCard
                        title="Deworming"
                        value={stats.deworming}
                        icon={Droplets}
                        color="bg-gradient-to-r from-cyan-600 to-cyan-700"
                      />
                      <StatCard
                        title="Treatments"
                        value={stats.treatments}
                        icon={Activity}
                        color="bg-gradient-to-r from-blue-800 to-blue-900"
                      />
                      <StatCard
                        title="AI Pending"
                        value={stats.aiPending}
                        icon={AlertTriangle}
                        color="bg-gradient-to-r from-violet-800 to-violet-900"
                      />
                    </div>
                  </div>

                  {/* RIGHT CONTENT */}
                  {/* <div className="xl:col-span-6 h-full grid grid-cols-1 xl:grid-cols-2 gap-2">

                    <div className="space-y-2 max-h-[calc(100vh-220px)]">
                      <div className="flex-[5] overflow-hidden">
                        <ActivityLog logs={activityLogs} />
                      </div>

                      <div className="flex-[5] overflow-hidden">
                        <AlertsPanel
                          lowStock={stats.lowStock}
                          aiPending={stats.aiPending}
                        />
                      </div> 
                    </div>

                    <div className="overflow-y-auto max-h-[calc(100vh-170px)]">
                      <CalendarPanel />
                    </div>
                  </div> */}
                  <div className="xl:col-span-6 h-full grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {/* Activity */}
                    <div className="h-full">
                      <ActivityLog logs={activityLogs} />
                    </div>

                    {/* Calendar */}
                    <div className="h-full overflow-auto">
                      <CalendarPanel />
                    </div>
                  </div>
                </div>

                {/* ================= CHARTS SECTION ================= */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-4">
                  {/* LINE GRAPH (9 columns) */}
                  <div className="xl:col-span-9 bg-white rounded-2xl shadow p-4 border border-gray-200">
                    <h3 className="font-semibold mb-3">Raisers per Address</h3>

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

                  {/* PIE CHART (3 columns – aligned with Calendar) */}
                  {!loading && livestockByType.length > 0 && (
                    <div className="xl:col-span-3 bg-white rounded-2xl shadow p-4 flex flex-col border border-gray-200">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
