import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const addSetContent = async (token, set_content, set_id) => {
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/set_content/${set_id}/`, set_content, {
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

export default addSetContent;