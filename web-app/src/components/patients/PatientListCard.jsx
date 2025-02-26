import {Card, Modal, Tooltip} from "antd";
import PropTypes from "prop-types";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {useState} from "react";
import PatientViewModal from "./PatientViewModal.jsx";

const PatientListCard = ({patient, handleEditPatient, handleDeletePatient}) => {
    const [showModalInfo, setShowModalInfo] = useState(false);

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

    const handleViewPatient = () => {
        setShowModalInfo(true);
    };

    const actions = [
        <Tooltip title="Просмотр пациента" key={"viewPatient"}>
            <EyeOutlined
                onClick={handleViewPatient}
            />
        </Tooltip>,

        <Tooltip title="Редактирование пациента" key={"editPatient"}>
            <EditOutlined
                onClick={() => {
                    handleEditPatient(patient);
                }}
            />
        </Tooltip>,
        <Tooltip title="Удаление пациента" key={"deletePatient"}>
            <DeleteOutlined
                onClick={deletePatientConfirm}
                style={{color: "red"}}
            />
        </Tooltip>,
    ];

    return (
        <>
            <Card
                type="inner"
                title={`${patient.last_name} ${patient.first_name}`}
                actions={actions}
            >
                <p><strong>📅 Дата рождения:</strong> {birthday.toLocaleString('ru-RU', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                })}</p>
                {patient.phone && <p><strong>📞 Телефон:</strong> {patient.phone}</p>}
                {patient.email && <p><strong>✉️ Email:</strong> {patient.email}</p>}
            </Card>

            <PatientViewModal
                visible={showModalInfo}
                onCancel={() => setShowModalInfo(false)}
                patient={patient}
            />
            </>
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
