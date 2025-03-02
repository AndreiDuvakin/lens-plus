import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const AddLensIssue = async (token, lens_issue) => {
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/lens_issues/`, lens_issue, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 403) {
            throw new Error("Ошибка авторизации: пользователь неайден или токен недействителен");
        }
        throw new Error(error.message);
    }
};

export default AddLensIssue;