import CONFIG from "../../core/Config.jsx";
import axios from "axios";


const addLens = async (token, lens) => {
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/lenses/`, lens, {
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

export default addLens;