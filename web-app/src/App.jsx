import {BrowserRouter as Router} from "react-router-dom";
import AppRouter from "./AppRouter.jsx";
import {AuthProvider} from "./AuthContext.jsx";
import "/src/styles/app.css";

const App = () => (
    <AuthProvider>
        <Router>
            <AppRouter/>
        </Router>
    </AuthProvider>
);

export default App
