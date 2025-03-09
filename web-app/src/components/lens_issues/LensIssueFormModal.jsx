import {useEffect, useState} from "react";
import {Modal, Form, Input, Select, Button, notification, Typography, Collapse, Steps} from "antd";
import PropTypes from "prop-types";
import getAllPatients from "../../api/patients/GetAllPatients.jsx";
import getAllLenses from "../../api/lenses/GetAllLenses.jsx";
import {useAuth} from "../../AuthContext.jsx";

const {Option} = Select;

const LensIssueFormModal = ({visible, onCancel, onSubmit}) => {
    const {user} = useAuth();
    const [patients, setPatients] = useState([]);
    const [lenses, setLenses] = useState([]);

    const [searchPatientString, setSearchPatientString] = useState("");
    const [searchLensString, setSearchLensString] = useState("");

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedLens, setSelectedLens] = useState(null);

    const [currentStep, setCurrentStep] = useState(0);

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
            // const values = await form.validateFields();
            onSubmit({...values, patient: selectedPatient});
            setSelectedPatient(null);
        } catch (errorInfo) {
            console.log("Validation Failed:", errorInfo);
        }
    };

    const filteredPatients = patients
        .filter((patient) => {
            const searchLower = searchPatientString.toLowerCase();

            return Object.values(patient)
                .filter(value => typeof value === "string")
                .some(value => value.toLowerCase().includes(searchLower));
        });

    const patientsItems = filteredPatients.map((patient) => (
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
                    <Button type="primary" onClick={() => setSelectedPatient(patient)}>Выбрать</Button>
                </div>,
        }
    ));

    const filteredLenses = lenses.filter((lens) => {
        const searchLower = searchLensString.toLowerCase();

        return Object.values(lens)
            .filter(value => typeof value === "string")
            .some(value => value.toLowerCase().includes(searchLower));
    })

    const lensesItems = filteredLenses.map((lens) => (
        {
            key: lens.id,
            label: `Линза ${lens.side} ${lens.diameter} мм`,
            children:
                <div>
                    <p><b>Диаметр:</b> {lens.diameter}</p>
                    <p><b>Тор:</b> {lens.tor}</p>
                    <p><b>Пресетная рефракция:</b> {lens.preset_refraction}</p>
                    <p><b>Диаметр:</b> {lens.diameter}</p>
                    <p><b>FVC:</b> {lens.fvc}</p>
                    <p><b>Острота зрения (Trial):</b> {lens.trial}</p>
                    <p><b>Периферийная торичность:</b> {lens.periphery_toricity}</p>
                    <p><b>Сторона:</b> {lens.side}</p>
                    <p><b>Esa:</b> {lens.esa}</p>
                    <Button type="primary" onClick={() => setSelectedLens(lens)}>Выбрать</Button>
                </div>,
        }
    ));

    const SelectPatientStep = () => {
        return selectedPatient ? (
            <div style={{padding: "10px", background: "#f5f5f5", borderRadius: 5, marginBottom: 15}}>
                <Typography.Text strong>
                    {selectedPatient.last_name} {selectedPatient.first_name}
                </Typography.Text>
                <p><b>Дата рождения:</b> {new Date(selectedPatient.birthday).toLocaleDateString("ru-RU")}</p>
                <p><b>Email:</b> {selectedPatient.email}</p>
                <p><b>Телефон:</b> {selectedPatient.phone}</p>
                <Button
                    type="primary"
                    onClick={() => setSelectedPatient(null)}
                    danger
                >
                    Выбрать другого пациента
                </Button>
            </div>
        ) : (
            <>
                <Input
                    placeholder="Поиск пациента"
                    value={searchPatientString}
                    onChange={(e) => setSearchPatientString(e.target.value)}
                    style={{marginBottom: 16}}
                    allowClear
                />

                <div style={{maxHeight: 300, overflowY: "auto", border: "1px solid #d9d9d9", padding: 8}}>
                    <Collapse
                        items={patientsItems}
                    />
                </div>
            </>
        )
    };

    const SelectLensStep = () => {
        return selectedLens ? (
            <div style={{padding: "10px", background: "#f5f5f5", borderRadius: 5, marginBottom: 15}}>
                <Typography.Text strong>
                    {selectedLens.diameter} {selectedLens.tor} {selectedLens.preset_refraction}
                </Typography.Text>
                <p><b>Диаметр:</b> {selectedLens.diameter}</p>
                <p><b>Тор:</b> {selectedLens.tor}</p>
                <p><b>Пресетная рефракция:</b> {selectedLens.preset_refraction}</p>
                <p><b>Диаметр:</b> {selectedLens.diameter}</p>
                <p><b>FVC:</b> {selectedLens.fvc}</p>
                <p><b>Острота зрения (Trial):</b> {selectedLens.trial}</p>
                <p><b>Периферийная торичность:</b> {selectedLens.periphery_toricity}</p>
                <p><b>Сторона:</b> {selectedLens.side}</p>
                <p><b>Esa:</b> {selectedLens.esa}</p>
                <Button
                    type="primary"
                    onClick={() => setSelectedLens(null)}
                    danger
                >
                    Выбрать другую линзу
                </Button>
            </div>
        ) : (
            <>
                <Input
                    placeholder="Поиск линз"
                    value={searchLensString}
                    onChange={(e) => setSearchLensString(e.target.value)}
                    style={{marginBottom: 16}}
                    allowClear
                />

                <div style={{maxHeight: 300, overflowY: "auto", border: "1px solid #d9d9d9", padding: 8}}>
                    <Collapse
                        items={lensesItems}
                    />
                </div>
            </>
        )
    };

    const ConfirmStep = () => {
        return (
            <div style={{padding: "10px", background: "#f5f5f5", borderRadius: 5, marginBottom: 15}}>
                <Typography.Text strong>
                    {selectedPatient.last_name} {selectedPatient.first_name}
                </Typography.Text>
                <p><b>Дата рождения:</b> {new Date(selectedPatient.birthday).toLocaleDateString("ru-RU")}</p>
                <p><b>Email:</b> {selectedPatient.email}</p>
                <p><b>Телефон:</b> {selectedPatient.phone}</p>
                <p><b>Линза:</b> {selectedLens.diameter} {selectedLens.tor} {selectedLens.preset_refraction}</p>
            </div>
        )
    };

    const steps = [
        {
            title: 'Выбор пациента',
            content: <SelectPatientStep/>,
        },
        {
            title: 'Выбор линзы',
            content: <SelectLensStep/>,
        },
        {
            title: 'Подтверждение',
            content: <ConfirmStep/>,
        },
    ]

    return (
        <Modal
            title="Выдача линзы пациенту"
            open={visible}
            onCancel={() => {
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

            {steps[currentStep].content}
            <Steps
                current={currentStep}
                items={steps}
                style={{marginTop: 16}}
                direction={"horizontal"}
            />


        </Modal>
    );
};

LensIssueFormModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default LensIssueFormModal;
