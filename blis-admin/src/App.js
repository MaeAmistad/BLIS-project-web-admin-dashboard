import {Routes, Route} from "react-router-dom";
import Login from "./scenes/signin"
import Dashboard from "./scenes/dashboard";
import RaiserProfile from "./scenes/raiserProfile"
import LivestockInventory from "./scenes/lsInventory"
import VaccineTracking from "./scenes/vaccineTracking"
import MorMorRecord from "./scenes/morMorRecord"
import MonitoringReport from "./scenes/monitoringReport"
import ScheduleVaccination from "./scenes/scheduleVaccination"
import Account from "./scenes/account"
// import Profile from "./scenes/profile"

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
              <Route path="/morbility-mortality" element={<MorMorRecord/>}/>
              <Route path="/monitoring-Report" element={<MonitoringReport/>}/>
              <Route path="/schedule-vaccination" element={<ScheduleVaccination/>}/>
              <Route path="/account" element={<Account/>}/>
              {/* <Route path="/profile" element={<Profile/>}/> */}
            </Routes>
          </main>
          </div>
  )
}

export default App;
