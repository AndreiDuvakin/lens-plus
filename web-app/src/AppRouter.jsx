import {Routes, Route, Navigate} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";


const AppRouter = () => (
    <Routes>
        <Route path="/login" element={<LoginPage/>}/>

        <Route element={<PrivateRoute/>}>
            <Route element={<MainLayout/>}>
                <Route path={"/"} element={<p>1234</p>}/>
                <Route path={"*"} element={<Navigate to={"/"}/>}/>
            </Route>
        </Route>
    </Routes>
)

export default AppRouter;