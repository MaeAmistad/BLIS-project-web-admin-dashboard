import { Routes, Route } from "react-router-dom";
import Login from "./scenes/signin";
import Dashboard from "./scenes/dashboard";
import RaiserProfile from "./scenes/raiserProfile";
import LivestockInventory from "./scenes/lsInventory";
import VaccineTracking from "./scenes/vaccineTracking";
import HealthandMedical from "./scenes/healthMedRecords";
import InventoryandSupplies from "./scenes/inventorySupplies";
import ReportandAnalytics from "./scenes/reportAnalytics";
import Account from "./scenes/account";
import UserProfile from "./components/userprofile";
import Settings from "./scenes/settings";
import React, { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    document.title = "Bantay Livestock";
  }, []);

  return (
    <div className="app">
      <main className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/raiserProfile"
            element={
              <ProtectedRoute>
                <RaiserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Ls-inventory"
            element={
              <ProtectedRoute>
                <LivestockInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vaccinett"
            element={
              <ProtectedRoute>
                <VaccineTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/healthandmed"
            element={
              <ProtectedRoute>
                <HealthandMedical />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventorySupplies"
            element={
              <ProtectedRoute>
                <InventoryandSupplies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportsAnalytics"
            element={
              <ProtectedRoute>
                <ReportandAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userprofile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {/* <Route path="/settings" element={<Settings />} /> */}
          {/* <Route path="/profile" element={<Profile/>}/> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
