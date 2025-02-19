import {Routes, Route, Navigate} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LensPage from "./pages/LensesPage.jsx";


const AppRouter = () => (
    <Routes>
        <Route path="/login" element={<LoginPage/>}/>

        <Route element={<PrivateRoute/>}>
            <Route element={<MainLayout/>}>
                <Route path={"/patients"} element={<PatientsPage/>}/>
                <Route path={"/lenses"} element={<LensPage/>}/>
                <Route path={"/"} element={<HomePage/>}/>
            </Route>
        </Route>
        <Route path={"*"} element={<Navigate to={"/"}/>}/>
    </Routes>
)

export default AppRouter;