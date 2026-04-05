import Routing from "./routes/Routing";
import { ThemeProvider } from "@/context/ThemeContext";

function App(){
    return(
        <ThemeProvider>
            <Routing />
        </ThemeProvider>
    );
}

export default App;