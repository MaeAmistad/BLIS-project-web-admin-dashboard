import {Routes, Route} from "react-router-dom";
// import Login from "./scenes/Login"
import Dashboard from "./scenes/dashboard";
import RaiserProfile from "./scenes/raiserProfile"
import LivestockInventory from "./scenes/lsInventory"
import VaccineTracking from "./scenes/vaccineTracking"
import MorMorRecord from "./scenes/morMorRecord"
// import Account from "./scenes/account"
// import Profile from "./scenes/profile"

function App() {

  return (

         <div className="app">  
          <main className="content"> 
            <Routes>
              {/* <Route path="/" element={<Login/>}/> */}
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/raiserProfile" element={<RaiserProfile/>}/>
              <Route path="/Lsinventory" element={<LivestockInventory/>}/>
              <Route path="/vaccinett" element={<VaccineTracking/>}/>
              <Route path="/mortabilitymr" element={<MorMorRecord/>}/>
              {/* <Route path="/account" element={<Account/>}/>
              <Route path="/profile" element={<Profile/>}/> */}
            </Routes>
          </main>
          </div>
  )
}

export default App;
