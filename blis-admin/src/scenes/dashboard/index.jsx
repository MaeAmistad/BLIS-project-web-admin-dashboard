import {useMode } from '../../../src/theme';
import Topbar from "../global/Topbar";
import Sidebarr from "../global/Sidebar";
import {CssBaseline, ThemeProvider} from "@mui/material";

const Dashboard = () => {
      const [theme] = useMode();
    return  (
        <>
              <ThemeProvider theme={theme}>
                    <CssBaseline/>
                    <div>
                         <Sidebarr/>
                         <div>
                             <Topbar/>
                         </div>
                    </div>
              </ThemeProvider>
           
            
        </>
    )
}

export default Dashboard;