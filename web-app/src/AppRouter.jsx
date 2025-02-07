import {Routes, Route} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.jsx";


const AppRouter = () => (
    <Routes>
        <Route path="/login"/>

        <Route element={<PrivateRoute/>}>

        </Route>
    </Routes>
)

export default AppRouter;