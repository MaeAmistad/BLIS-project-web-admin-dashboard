import { useEffect, useState } from "react";
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
  orderBy,
  limit,
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

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const BAR_COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // purple
  "#06B6D4", // cyan
  "#F97316", // orange
];

/* =========================
   STAT CARD COMPONENT
========================= */
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div
    className={`rounded-2xl shadow p-4 text-white ${color} hover:scale-[1.02] transition`}
  >
    <div className="flex justify-between items-center">
      <p className="text-sm opacity-90">{title}</p>
      <Icon className="w-6 h-6 opacity-80" />
    </div>
    <h2 className="text-3xl font-bold mt-2">{value}</h2>
  </div>
);

/* =========================
   ACTIVITY LOG COMPONENT
========================= */
const ActivityLog = ({ logs }) => (
  <div className="bg-white rounded-2xl shadow p-4 max-h-4xl overflow-y-auto">
    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
      <Activity size={18} /> Recent Activity
    </h3>

    {logs.length === 0 ? (
      <p className="text-sm text-gray-500">No recent activity</p>
    ) : (
      <ul className="space-y-4">
        {logs.map((log, index) => (
          <li key={index} className="border-l-4 border-blue-500 pl-3 text-sm">
            <p className="font-medium">{log.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AlertsPanel = ({ lowStock, aiPending }) => (
  <div className="bg-white rounded-2xl shadow p-4 mt-6">
    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
      <AlertTriangle size={18} /> Alerts
    </h3>

    <ul className="space-y-2 text-sm">
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

/* =========================
   DASHBOARD MAIN
========================= */
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
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
          }))
        );

        /* =========================
           LIVESTOCK
        ========================= */
        const livestockSnap = await getDocs(collectionGroup(db, "livestock"));

        /* =========================
           USERS
        ========================= */
        const activeUsersSnap = await getDocs(
          query(collection(db, "users"), where("status", "==", "ACTIVE"))
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
          if (data.type.toUpperCase() === "VACCINATION") vaccinationCount++;
          if (data.type.toUpperCase() === "TREATMENT") treatmentCount++;
          if (data.type.toUpperCase() === "AI") aiPendingCount++;
          if (data.type.toUpperCase() === "DEWORMING") dewormingCount++;
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

        /* =========================
           ACTIVITY LOGS (OPTIONAL)
           Replace with real collection later
        ========================= */
        setActivityLogs([
          {
            message: "Vaccination added for Cow #A102",
            timestamp: Date.now() - 1000 * 60 * 30,
          },
          {
            message: "Inventory updated: Dewormer",
            timestamp: Date.now() - 1000 * 60 * 90,
          },
          {
            message: "AI scheduled for Raiser Juan Dela Cruz",
            timestamp: Date.now() - 1000 * 60 * 180,
          },
        ]);

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

  return (
    <div className="app flex">
      <Sidebarr />

      <div className="content flex-grow overflow-auto h-screen">
        <Topbar />

        <div className="p-6">
          <Headerr
            title="Dashboard"
            subtitle={`Welcome, ${user?.role} ${user?.name}`}
          />

          {loading ? (
            <p className="mt-6">Loading dashboard...</p>
          ) : (
            <>
              {/* ================= MAIN GRID ================= */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6">
                {/* LEFT CONTENT */}
                <div className="xl:col-span-9 space-y-6">
                  {/* ================= KPI CARDS ================= */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
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
                      color="bg-gradient-to-r from-green-500 to-green-600"
                    />
                    <StatCard
                      title="Active Users"
                      value={stats.activeUsers}
                      icon={Users}
                      color="bg-gradient-to-r from-indigo-500 to-indigo-600"
                    />
                    <StatCard
                      title="Inventory Items"
                      value={stats.inventoryItems}
                      icon={Boxes}
                      color="bg-gradient-to-r from-purple-500 to-purple-600"
                    />
                  </div>

                  {/* HEALTH OVERVIEW */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                      color="bg-gradient-to-r from-cyan-500 to-cyan-600"
                    />
                    <StatCard
                      title="Treatments"
                      value={stats.treatments}
                      icon={Activity}
                      color="bg-gradient-to-r from-orange-500 to-orange-600"
                    />
                    <StatCard
                      title="AI Pending"
                      value={stats.aiPending}
                      icon={AlertTriangle}
                      color="bg-gradient-to-r from-red-500 to-red-600"
                    />
                  </div>
                  {/* CHART */}
                  <div className="bg-white rounded-2xl shadow p-4 h-80">
                    <h3 className="font-semibold mb-3">Raisers per Address</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={raisersByAddress}>
                        <XAxis dataKey="address" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count">
                          {raisersByAddress.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={BAR_COLORS[index % BAR_COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xl:col-span-3">
                  <ActivityLog logs={activityLogs} />
                  <AlertsPanel
                    lowStock={stats.lowStock}
                    aiPending={stats.aiPending}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
