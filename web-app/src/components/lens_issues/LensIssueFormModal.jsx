import {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Collapse, Button, notification, List} from "antd";
import PropTypes from "prop-types";
import getAllPatients from "../../api/patients/GetAllPatients.jsx";
import getAllLenses from "../../api/lenses/GetAllLenses.jsx";
import {useAuth} from "../../AuthContext.jsx";

const {Option} = Select;
const {Panel} = Collapse;

const LensIssueFormModal = ({visible, onCancel, onSubmit}) => {
    const {user} = useAuth();

    const [form] = Form.useForm();
    const [patients, setPatients] = useState([]);
    const [lenses, setLenses] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedLens, setSelectedLens] = useState(null);

    const [searchPatientString, setSearchPatientString] = useState("");
    const [searchLensString, setSearchLensString] = useState("");

    useEffect(() => {
        if (visible) {
            fetchPatients();
            fetchLenses();
        }
    }, [visible]);

    const fetchPatients = async () => {
        try {
            const data = await getAllPatients(user.token);
            setPatients(data);
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка загрузки пациентов",
                description: "Проверьте подключение к сети.",
            });
        }
    };

    const fetchLenses = async () => {
        try {
            const data = await getAllLenses(user.token);
            setLenses(data);
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка загрузки линз",
                description: "Проверьте подключение к сети.",
            });
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onSubmit({...values, patient: selectedPatient, lens: selectedLens});
            form.resetFields();
            setSelectedPatient(null);
            setSelectedLens(null);
        } catch (errorInfo) {
            console.log("Validation Failed:", errorInfo);
        }
    };

    const flteredPatients = patients
        .filter((patient) => {
            const searchLower = searchPatientString.toLowerCase();

            return Object.values(patient)
                .filter(value => typeof value === "string")
                .some(value => value.toLowerCase().includes(searchLower));
        });

    const filteredLenses = lenses
        .filter((lens) => {
            const searchLower = searchLensString.toLowerCase();
            return lens.side.toLowerCase().includes(searchLower);
        });

    const items = flteredPatients.map((patient) => (
        {
            key: patient.id,
            label: `${patient.last_name} ${patient.first_name} (${new Date(patient.birthday).toLocaleDateString("ru-RU")})`,
            children:
                <div>
                    <p><b>Пациент:</b> {patient.last_name} {patient.first_name}</p>
                    <p><b>Дата рождения:</b> {new Date(patient.birthday).toLocaleDateString("ru-RU")}</p>
                    <p><b>Диагноз:</b> {patient.diagnosis}</p>
                    <p><b>Email:</b> {patient.email}</p>
                    <p><b>Телефон:</b> {patient.phone}</p>
                </div>,
        }
    ));

    return (
        <Modal
            title="Выдача линзы пациенту"
            open={visible}
            onCancel={() => {
                form.resetFields();
                setSelectedPatient(null);
                setSelectedLens(null);
                onCancel();
            }}
            onOk={handleOk}
            okText="Сохранить"
            cancelText="Отмена"
            maskClosable={false}
            centered
        >
            <Form form={form} layout="vertical">

                <Form.Item
                    label="Пациент"
                    required
                    rules={[{required: true, message: "Выберите пациента"}]}
                >
                    <Input
                        placeholder="Поиск пациента"
                        value={searchPatientString}
                        onChange={(e) => setSearchPatientString(e.target.value)}
                        style={{marginBottom: 16}}
                        allowClear
                    />

                    <div style={{maxHeight: 300, overflowY: "auto", border: "1px solid #d9d9d9", padding: 8}}>
                        <Collapse
                            items={items}
                        />
                    </div>
                </Form.Item>

                <Form.Item name="lens" label="Линза" rules={[{required: true, message: "Выберите линзу"}]}>
                    <Select placeholder="Выберите линзу"
                            onChange={(id) => setSelectedLens(lenses.find(l => l.id === id))}>
                        {lenses.map(lens => (
                            <Option key={lens.id} value={lens.id}>
                                {`Диаметр: ${lens.diameter}, Тор: ${lens.tor}, Пресет рефракции: ${lens.preset_refraction}`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="issue_date" label="Дата выдачи"
                           rules={[{required: true, message: "Укажите дату выдачи"}]}>
                    <Input placeholder="Введите дату выдачи"/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

LensIssueFormModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    lensIssue: PropTypes.shape({
        issue_date: PropTypes.string,
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
        doctor: PropTypes.shape({
            last_name: PropTypes.string,
            first_name: PropTypes.string,
            login: PropTypes.string,
        }),
        lens: PropTypes.shape({
            id: PropTypes.number.isRequired,
            tor: PropTypes.number.isRequired,
            diameter: PropTypes.number.isRequired,
            esa: PropTypes.number.isRequired,
            fvc: PropTypes.number.isRequired,
            preset_refraction: PropTypes.number.isRequired,
            periphery_toricity: PropTypes.number.isRequired,
            side: PropTypes.string.isRequired,
            issued: PropTypes.bool.isRequired,
            trial: PropTypes.number.isRequired,
        }),
    }),
};

export default LensIssueFormModal;
