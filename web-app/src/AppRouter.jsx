import {Routes, Route} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";


const AppRouter = () => (
    <Routes>
        <Route path="/login" element={<LoginPage/>}/>

        <Route element={<PrivateRoute/>}>
            <Route path={"/"} element={<p>1234</p>}/>
        </Route>
    </Routes>
)

export default AppRouter;