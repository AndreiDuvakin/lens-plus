import axios from "axios";
import CONFIG from "../../core/Config.jsx";


const AddPatient = async (token, patient) => {
    try {
        const response = await axios.post(`${CONFIG.BASE_URL}/patients/`, patient, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export default AddPatient;