import {useEffect, useState} from "react";
import {
    Modal, Input, Button, notification, Typography, Collapse, Steps, Row, Alert, Col, DatePicker, Spin, Grid
} from "antd";
import PropTypes from "prop-types";
import getAllPatients from "../../api/patients/GetAllPatients.jsx";
import {useAuth} from "../../AuthContext.jsx";
import dayjs from "dayjs";
import getNotIssuedLenses from "../../api/lenses/GetNotIssuedLenses.jsx";

const {useBreakpoint} = Grid;

const LensIssueFormModal = ({visible, onCancel, onSubmit}) => {
    const {user} = useAuth();
    const screens = useBreakpoint();

    const [patients, setPatients] = useState([]);
    const [lenses, setLenses] = useState([]);

    const [searchPatientString, setSearchPatientString] = useState("");
    const [searchLensString, setSearchLensString] = useState("");
    const [issueDate, setIssueDate] = useState(dayjs(new Date()));

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedLens, setSelectedLens] = useState(null);

    const [loading, setLoading] = useState(false);

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
            console.error(error);
            notification.error({
                message: "Ошибка загрузки пациентов", description: "Проверьте подключение к сети.",
            });
        }
    };

    const fetchLenses = async () => {
        try {
            const data = await getNotIssuedLenses(user.token);
            setLenses(data);
        } catch (error) {
            console.error(error);
            notification.error({
                message: "Ошибка загрузки линз", description: "Проверьте подключение к сети.",
            });
        }
    };

    const handleOk = async () => {
        try {
            setLoading(true);
            setCurrentStep(0);
            onSubmit(issueDate.format("YYYY-MM-DD"), selectedPatient.id, selectedLens.id);
            setSelectedPatient(null);
            setSelectedLens(null);
            setIssueDate(dayjs(new Date()));
            setLoading(false);
        } catch (errorInfo) {
            console.error("Validation Failed:", errorInfo);
        }
    };

    const filteredPatients = patients
        .filter((patient) => {
            const searchLower = searchPatientString.toLowerCase();

            return Object.values(patient)
                .filter(value => typeof value === "string")
                .some(value => value.toLowerCase().includes(searchLower));
        });

    const patientsItems = filteredPatients.map((patient) => ({
            key: patient.id,
            label: `${patient.last_name} ${patient.first_name} (${new Date(patient.birthday).toLocaleDateString("ru-RU")})`,
            children: <div>
                <p><b>Пациент:</b> {patient.last_name} {patient.first_name}</p>
                <p><b>Дата рождения:</b> {new Date(patient.birthday).toLocaleDateString("ru-RU")}</p>
                <p><b>Диагноз:</b> {patient.diagnosis}</p>
                <p><b>Email:</b> {patient.email}</p>
                <p><b>Телефон:</b> {patient.phone}</p>
                <Button type="primary" onClick={() => setSelectedPatient(patient)}>Выбрать</Button>
            </div>,
        }));

    const filteredLenses = lenses.filter((lens) => {
        const searchLower = searchLensString.toLowerCase();

        return Object.values(lens)
            .filter(value => typeof value === "string")
            .some(value => value.toLowerCase().includes(searchLower));
    })

    const lensesItems = filteredLenses.map((lens) => ({
            key: lens.id, label: `Линза ${lens.side} ${lens.diameter} мм`, children: <div>
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
        }));

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
            </div>) : (<>
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
            </>)
    };

    const SelectLensStep = () => {
        return selectedLens ? (<div style={{padding: "10px", background: "#f5f5f5", borderRadius: 5, marginBottom: 15}}>
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
            </div>) : (<>
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
            </>)
    };

    const ConfirmStep = () => {
        return (<>
                <Alert
                    type="warning"
                    message="Внимание! После подтверждения линза будет считаться выданной, данное действие нельзя будет отменить."
                    style={{marginBottom: 15}}
                />

                <Row style={{padding: "10px", background: "#f5f5f5", borderRadius: 5, marginBottom: 15}}
                     gutter={[16, 16]}>
                    <Col xs={24} md={16} style={{display: "flex", alignItems: "center"}}>
                        <Typography.Text strong>
                            Дата выдачи: {issueDate?.toDate().toLocaleDateString("ru-RU")}
                        </Typography.Text>
                    </Col>
                    <Col xs={24} md={8}>
                        <DatePicker
                            value={issueDate}
                            onChange={(date) => setIssueDate(date)}
                            format="DD.MM.YYYY"
                            style={{width: "100%"}}
                        />
                    </Col>
                </Row>

                <div style={{padding: "10px", background: "#f5f5f5", borderRadius: 5, marginBottom: 15}}>
                    <Typography.Text strong>
                        {selectedPatient.last_name} {selectedPatient.first_name}
                    </Typography.Text>
                    <p><b>Дата рождения:</b> {new Date(selectedPatient.birthday).toLocaleDateString("ru-RU")}</p>
                    <p><b>Email:</b> {selectedPatient.email}</p>
                    <p><b>Телефон:</b> {selectedPatient.phone}</p>
                    <p><b>Линза:</b> {selectedLens.diameter} {selectedLens.tor} {selectedLens.preset_refraction}</p>
                </div>

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
                </div>
            </>);
    };

    const steps = [{
        title: 'Выбор пациента', content: <SelectPatientStep/>,
    }, {
        title: 'Выбор линзы', content: <SelectLensStep/>,
    }, {
        title: 'Подтверждение', content: <ConfirmStep/>,
    },];

    const isActiveNextButton = () => {
        if (currentStep === 0 && !selectedPatient) {
            return false;
        }

        return !(currentStep === 1 && !selectedLens);
    };

    const isActivePrevButton = () => {
        return currentStep > 0;
    };

    const isActiveFinishButton = () => {
        return currentStep === steps.length - 1;
    };

    return (<Modal
            title="Выдача линзы пациенту"
            open={visible}
            onCancel={() => {
                setSelectedPatient(null);
                setSelectedLens(null);
                setCurrentStep(0);
                setIssueDate(dayjs(new Date()));
                onCancel();
            }}
            footer={null}
            maskClosable={false}
            width={!screens.xs ? 700 : "90%"}
            centered
        >
            {loading ? (<div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "70vh"}}>
                    <Spin size="large"/>
                </div>) : (<div style={{maxHeight: "70vh", overflowY: "auto", padding: "10px"}}>
                    {steps[currentStep].content}
                </div>)}


            {!screens.xs && (<Steps
                    current={currentStep}
                    items={steps}
                    style={{marginTop: 16}}
                    direction={!screens.xs ? "horizontal" : "vertical"}
                />)}

            <Row
                justify="end"
                style={{marginTop: 20}}
                gutter={[8, 8]}
            >
                <Button
                    style={{marginRight: 8}}
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={!isActivePrevButton()}
                >
                    Назад
                </Button>
                <Button
                    type="primary"
                    onClick={async () => {
                        if (isActiveFinishButton()) {
                            await handleOk();
                        } else {
                            setCurrentStep(currentStep + 1);
                        }
                    }}
                    disabled={!isActiveNextButton() && !isActiveFinishButton()}
                >
                    {isActiveFinishButton() ? "Завершить" : "Далее"}
                </Button>
            </Row>
        </Modal>);
};

LensIssueFormModal.propTypes = {
    visible: PropTypes.bool.isRequired, onCancel: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired,
};

export default LensIssueFormModal;
