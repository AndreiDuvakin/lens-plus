import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const getSetContentBySetId = async (token, set_id) => {
    try {
        const response = await axios.get(`${CONFIG.BASE_URL}/set_content/${set_id}/`, {
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

export default getSetContentBySetId;