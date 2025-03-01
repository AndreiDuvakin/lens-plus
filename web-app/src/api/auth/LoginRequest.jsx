import axios from "axios";
import CONFIG from "../../core/Config.jsx";

const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/login/`, loginData, {
            withCredentials: true,
        });
        return response.data.access_token;
    } catch (error) {
        if (error.status === 403) {
            throw new Error("Неверное имя пользователя или пароль")
        }

        throw new Error(error.message);
    }
};

export default loginUser;