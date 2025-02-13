import {Card, Modal} from "antd";
import PropTypes from "prop-types";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const PatientListCard = ({patient, handleEditPatient, handleDeletePatient}) => {
    const birthday = new Date(patient.birthday)

    const deletePatientConfirm = () => {
        Modal.confirm({
            title: "Удаление пациента",
            content: `Вы уверены, что хотите удалить пациента ${patient.last_name} ${patient.first_name}?`,
            okText: "Да, удалить",
            cancelText: "Отмена",
            onOk: () => handleDeletePatient(patient.id),
        });
    };

    return (
        <Card
            type="inner"
            title={`${patient.last_name} ${patient.first_name}`}
            actions={[
                <EditOutlined
                    onClick={() => {
                        handleEditPatient(patient);
                    }}
                    key={"editPatient"}
                />,
                <DeleteOutlined
                    onClick={deletePatientConfirm}
                    key={"deletePatient"}
                    style={{color: "red"}}
                />
            ]}
        >
            <p><strong>📅 Дата рождения:</strong> {birthday.toLocaleString('ru-RU', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            })}</p>
            {patient.phone && <p><strong>📞 Телефон:</strong> {patient.phone}</p>}
            {patient.email && <p><strong>✉️ Email:</strong> {patient.email}</p>}
        </Card>
    );
};

PatientListCard.propTypes = {
    patient: PropTypes.shape({
        id: PropTypes.number.isRequired,
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
    handleEditPatient: PropTypes.func.isRequired,
    handleDeletePatient: PropTypes.func.isRequired,
};

export default PatientListCard;
