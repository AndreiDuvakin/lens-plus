import { Card } from "antd";
import PropTypes from "prop-types";

const PatientListCard = ({ patient }) => {
    return (
        <Card
            hoverable={true}
            title={`${patient.last_name} ${patient.first_name}`}
        >
            <p><strong>📅 Дата рождения:</strong> {patient.birthday}</p>
            {patient.phone && <p><strong>📞 Телефон:</strong> {patient.phone}</p>}
            {patient.email && <p><strong>✉️ Email:</strong> {patient.email}</p>}
            {patient.diagnosis && <p><strong>🩺 Диагноз:</strong> {patient.diagnosis}</p>}
        </Card>
    );
};

PatientListCard.propTypes = {
    patient: PropTypes.shape({
        last_name: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        patronymic: PropTypes.string,
        birthday: PropTypes.string.isRequired,
        address: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        diagnosis: PropTypes.string,
        correction: PropTypes.string,
    }).isRequired,
};

export default PatientListCard;
