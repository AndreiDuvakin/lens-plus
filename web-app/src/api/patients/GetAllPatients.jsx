import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const getAllPatients = async (token) => {
    try {
        const response = await axios.get(`${CONFIG.BASE_URL}/patients/`, {
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

export default getAllPatients;