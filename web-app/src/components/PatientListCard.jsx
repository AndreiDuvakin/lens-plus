import { Card } from "antd";
import PropTypes from "prop-types";

const PatientListCard = ({ patient }) => {
    const birthday = new Date(patient.birthday)

    return (
        <Card
            hoverable
            type="inner"
            title={`${patient.last_name} ${patient.first_name}`}
            style={{ marginBottom: 16, borderRadius: 12 }}
        >
            <p><strong>📅 Дата рождения:</strong> {birthday.toLocaleString('ru-RU', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
            {patient.phone && <p><strong>📞 Телефон:</strong> {patient.phone}</p>}
            {patient.email && <p><strong>✉️ Email:</strong> {patient.email}</p>}
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
