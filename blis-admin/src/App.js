import {Routes, Route} from "react-router-dom";
// import Login from "./scenes/signin";
import Dashboard from "./scenes/dashboard";



function App() {

  return (

         <div className="app">  
          <main className="content"> 
            <Routes>
              {/* <Route path="/" element={<Login/>}/> */}
              <Route path="/" element={<Dashboard/>}/>
              {/* <Route path="/contacts" element={<Contacts/>}/> */}
              {/* <Route path="/invoices" element={<Invoices/>}/> */}
              {/* <Route path="/form" element={<Form/>}/> */}
              {/* <Route path="/bar" element={<Bar/>}/> */}
              {/* <Route path="/pie" element={<Pie/>}/> */}
              {/* <Route path="/line" element={<Line/>}/> */}
              {/* <Route path="/faq" element={<FAQ/>}/> */}
              {/* <Route path="/geography" element={<Geography/>}/> */}
              {/* <Route path="/calendar" element={<Calendar/>}/> */}
            </Routes>
          </main>
          </div>
  )
}

export default App;
