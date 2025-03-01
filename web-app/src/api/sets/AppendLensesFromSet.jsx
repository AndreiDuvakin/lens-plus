import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const appendLensesFromSet = async (token, set_id) => {
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/sets/append_lenses/${set_id}/`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            throw new Error("Ошибка авторизации: пользователь не найден или токен недействителен");
        } else {
            throw new Error(error.message);
        }
    }
};

export default appendLensesFromSet;