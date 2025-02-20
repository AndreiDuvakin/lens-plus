import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const deleteSetContent = async (token, set_content_id) => {
    try {
        const response = await axios.delete(`${CONFIG.BASE_URL}/set_content/${set_content_id}/`, {
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

export default deleteSetContent;