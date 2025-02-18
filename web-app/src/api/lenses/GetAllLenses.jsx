import axios from "axios";
import CONFIG from "../../core/Config.jsx";

const getAllLenses = async (token) => {
    try {
        const response = await axios.get(`${CONFIG.BASE_URL}/lenses/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw Error("Ошибка авторизации: пользователь неяден или токен недействителен");
        }
        throw Error(error.message);
    }
};

export default getAllLenses;