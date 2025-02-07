import {BrowserRouter as Router} from "react-router-dom";
import AppRouter from "./AppRouter.jsx";
import {AuthProvider} from "./AuthContext.jsx";

const App = () => (
    <AuthProvider>
        <Router>
            <AppRouter/>
        </Router>
    </AuthProvider>
);

export default App
