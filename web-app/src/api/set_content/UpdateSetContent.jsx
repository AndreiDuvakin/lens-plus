import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const updateSetContent = async (token, set_content) => {
    try {
        const response = await axios.put(`${CONFIG.BASE_URL}/set_content/${set_content.id}/`, set_content, {
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

export default updateSetContent;