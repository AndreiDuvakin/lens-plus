import {Routes, Route, Navigate} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";


const AppRouter = () => (
    <Routes>
        <Route path="/login" element={<LoginPage/>}/>

        <Route element={<PrivateRoute/>}>
            <Route element={<MainLayout/>}>
                <Route path={"/patients"} element={<PatientsPage/>}/>
                <Route path={"/"} element={<p>1234</p>}/>
            </Route>
        </Route>
        <Route path={"*"} element={<Navigate to={"/"}/>}/>
    </Routes>
)

export default AppRouter;