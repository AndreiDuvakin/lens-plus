import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const updateSet = async (token, set_id, set) => {
    try {
        const response = await axios.put(`${CONFIG.BASE_URL}/sets/${set_id}/`, set, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            throw new Error("Ошибка авторизации: пользователь не найден или токен недействителен");
        }
        throw new Error(error.message);
    }
};

export default updateSet;