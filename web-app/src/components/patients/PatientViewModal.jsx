import {Button, Col, Modal, Row, Typography, Divider} from "antd";
import PropTypes from "prop-types";

const { Text, Title } = Typography;

const PatientViewModal = ({ visible, onCancel, patient }) => {
    if (!patient) return null;

    return (
        <Modal
            title="Просмотр пациента"
            open={visible}
            onCancel={onCancel}
            footer={
                <Button onClick={onCancel} type="primary">
                    Закрыть
                </Button>
            }
        >
            <Row gutter={24}>
                <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                        <Title level={5}>👤 ФИО</Title>
                        <Text>{`${patient.last_name} ${patient.first_name} ${patient.patronymic || ''}`}</Text>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <Title level={5}>🎂 Дата рождения</Title>
                        <Text>
                            {new Date(patient.birthday).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </Text>
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <div style={{ marginBottom: 12 }}>
                        <Title level={5}>📞 Телефон</Title>
                        <Text>{patient.phone || 'Не указан'}</Text>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <Title level={5}>✉️ Email</Title>
                        <Text>{patient.email || 'Не указан'}</Text>
                    </div>

                    <div style={{ marginBottom: 12 }}>
                        <Title level={5}>🏠 Адрес</Title>
                        <Text>{patient.address || 'Не указан'}</Text>
                    </div>
                </Col>
            </Row>

            <Divider />

            <div style={{ marginBottom: 12 }}>
                <Title level={5}>🩺 Диагноз</Title>
                <Text>{patient.diagnosis || 'Не указан'}</Text>
            </div>

            <div style={{ marginBottom: 12 }}>
                <Title level={5}>👓 Коррекция</Title>
                <Text>{patient.correction || 'Не указ'}</Text>
            </div>
        </Modal>
    );
};

PatientViewModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    patient: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        patronymic: PropTypes.string,
        birthday: PropTypes.string,
        address: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        diagnosis: PropTypes.string,
        correction: PropTypes.string,
    }),
};

export default PatientViewModal;
