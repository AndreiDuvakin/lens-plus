import axios from "axios";
import CONFIG from "../../core/Config.jsx";

const getNotIssuedLenses = async (token) => {
    try {
        const response = await axios.get(`${CONFIG.BASE_URL}/lenses/not_issued/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            throw Error("Ошибка авторизации: пользователь неяден или токен недействителен");
        }
        throw Error(error.message);
    }
};

export default getNotIssuedLenses;