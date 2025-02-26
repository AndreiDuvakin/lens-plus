import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const addSet = async (token, set) => {
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/sets/`, set, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error("Ошибка авторизации: пользователь не найден или токен недействителен");
        }
        throw new Error(error.message);
    }
};

export default addSet;