import axios from "axios";


const updateLens = async (token, lensId, lensData) => {
    try {
        const response = await axios.put(`${CONFIG.BASE_URL}/lenses/${lensId}/`, lensData, {
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

export default updateLens;