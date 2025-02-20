import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const AddSet = async (token, set) => {
    try {
        const response = await axios.post(`${CONFIG.API_URL}/sets`, set, {
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

export default AddSet;