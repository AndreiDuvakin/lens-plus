import {Button, Col, Modal, Row, Typography, Divider} from "antd";
import PropTypes from "prop-types";

const {Text, Title} = Typography;

const LensViewModal = ({visible, onCancel, lens}) => {
    if (!lens) return null;

    return (
        <Modal
            title="Просмотр линзы"
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
                    <div style={{marginBottom: 12}}>
                        <Title level={5}>🔬 Тор</Title>
                        <Text>{lens.tor} D</Text>
                    </div>

                    <div style={{marginBottom: 12}}>
                        <Title level={5}>📏 Диаметр</Title>
                        <Text>{lens.diameter} мм</Text>
                    </div>

                    <div style={{marginBottom: 12}}>
                        <Title level={5}>🔄 Пресетная рефракция</Title>
                        <Text>{lens.preset_refraction} D</Text>
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <div style={{marginBottom: 12}}>
                        <Title level={5}>⚙️ Перефирийная торичность</Title>
                        <Text>{lens.periphery_toricity} D</Text>
                    </div>

                    <div style={{marginBottom: 12}}>
                        <Title level={5}>⛓ Сторона</Title>
                        <Text>{lens.side}</Text>
                    </div>

                    <div style={{marginBottom: 12}}>
                        <Title level={5}>✅ Статус выдачи</Title>
                        <Text>{lens.issued ? 'Выдана' : 'Не выдана'}</Text>
                    </div>
                </Col>
            </Row>

            <Divider/>

            <div style={{marginBottom: 12}}>
                <Title level={5}>⚖️ Пробная линза (Trial)</Title>
                <Text>{lens.trial.toFixed(2)} D</Text>
            </div>
        </Modal>
    );
};

LensViewModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    lens: PropTypes.shape({
        tor: PropTypes.number.isRequired,
        diameter: PropTypes.number.isRequired,
        preset_refraction: PropTypes.number.isRequired,
        periphery_toricity: PropTypes.number.isRequired,
        side: PropTypes.string.isRequired,
        issued: PropTypes.bool.isRequired,
        trial: PropTypes.number.isRequired,  // Указываем, что это число
    }),
};

export default LensViewModal;
