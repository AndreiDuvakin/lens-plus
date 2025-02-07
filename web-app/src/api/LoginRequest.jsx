import axios from "axios";
import CONFIG from "../core/Config.jsx";

export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/login/`, loginData, {
            withCredentials: true,
        });
        return response.data.access_token;
    } catch (error) {
        throw new Error("Login failed: " + error.message);
    }
};
