import {Routes, Route} from "react-router-dom";
import Dashboard from "./scenes/dashboard";
import RaiserProfile from "./scenes/raiserProfile"


function App() {

  return (

         <div className="app">  
          <main className="content"> 
            <Routes>
              {/* <Route path="/" element={<Login/>}/> */}
              {/* <Route path="/" element={<Dashboard/>}/> */}
              <Route path="/" element={<RaiserProfile/>}/>
              {/* <Route path="/invoices" element={<Invoices/>}/> */}
              {/* <Route path="/form" element={<Form/>}/> */}
              {/* <Route path="/bar" element={<Bar/>}/> */}
            </Routes>
          </main>
          </div>
  )
}

export default App;
