import {Routes, Route} from "react-router-dom";
import Login from "./scenes/signin"
import Dashboard from "./scenes/dashboard";
import RaiserProfile from "./scenes/raiserProfile"
import LivestockInventory from "./scenes/lsInventory"
import VaccineTracking from "./scenes/vaccineTracking"
import HealthandMedical from "./scenes/healthMedRecords"
import InventoryandSupplies from "./scenes/inventorySupplies"
import ReportandAnalytics from "./scenes/reportAnalytics"
import Account from "./scenes/account"
import UserProfile from "./components/userprofile"
 
function App() {

  return (

         <div className="app">  
          <main className="content"> 
            <Routes>
              <Route path="/" element={<Login/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/raiserProfile" element={<RaiserProfile/>}/>
              <Route path="/Ls-inventory" element={<LivestockInventory/>}/>
              <Route path="/vaccinett" element={<VaccineTracking/>}/>
              <Route path="/healthandmed" element={<HealthandMedical/>}/>
              <Route path="/inventorySupplies" element={<InventoryandSupplies/>}/>
              <Route path="/reportsAnalytics" element={<ReportandAnalytics/>}/>
              <Route path="/account" element={<Account/>}/>
              <Route path="/userprofile" element={<UserProfile/>}/>
              {/* <Route path="/profile" element={<Profile/>}/> */}
            </Routes>
          </main>
          </div>
  )
}

export default App;
