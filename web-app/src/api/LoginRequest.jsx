import axios from "axios";
import CONFIG from "../core/Config.jsx";

export const loginUser = async (loginData) => {
    console.log(loginData)
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/login/`, loginData, {
            withCredentials: true,
        });
        return response.data.access_token;
    } catch (error) {
        if (error.status === 401) {
            throw new Error("Неверное имя пользователя или пароль")
        }

        throw new Error(error.message);
    }
};
