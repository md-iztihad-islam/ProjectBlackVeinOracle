import Routing from "./routes/Routing";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

function App(){
    return(
        <ThemeProvider>
            <ThemeToggle />
            <Routing />
        </ThemeProvider>
    );
}

export default App;