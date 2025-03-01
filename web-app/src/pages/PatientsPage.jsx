import {useEffect, useState} from "react";
import {Input, Select, List, FloatButton, Row, Col, Spin, notification, Tooltip} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {useAuth} from "../AuthContext.jsx";
import getAllPatients from "../api/patients/GetAllPatients.jsx";
import PatientListCard from "../components/patients/PatientListCard.jsx";
import PatientFormModal from "../components/patients/PatientFormModal.jsx";
import updatePatient from "../api/patients/UpdatePatient.jsx";
import addPatient from "../api/patients/AddPatient.jsx";
import deletePatient from "../api/patients/DeletePatient.jsx";

const {Option} = Select;

const PatientsPage = () => {
    const {user} = useAuth();
    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [patients, setPatients] = useState([]);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatientsWithCache();
    }, []);

    useEffect(() => {
        if (!isModalVisible) {
            const intervalId = setInterval(fetchPatients, 5000);
            return () => clearInterval(intervalId);
        }
    }, [user, isModalVisible]);

    const fetchPatientsWithCache = async () => {
        const cachedData = localStorage.getItem("patientsData");
        const cacheTimestamp = localStorage.getItem("patientsTimestamp");

        if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 60 * 1000) {
            setPatients(JSON.parse(cachedData));
            setLoading(false);
            return;
        }

        await fetchPatients();
    };

    const fetchPatients = async () => {
        if (!user || !user.token) return;

        try {
            const data = await getAllPatients(user.token);
            setPatients(data);

            localStorage.setItem("patientsData", JSON.stringify(data));
            localStorage.setItem("patientsTimestamp", Date.now().toString());
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка загрузки данных",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            })
        }

        if (loading) {
            setLoading(false);
        }
    };

    const filteredPatients = patients
        .filter((patient) => {
            const searchLower = searchText.toLowerCase();

            return Object.values(patient)
                .filter(value => typeof value === "string")
                .some(value => value.toLowerCase().includes(searchLower));
        })
        .sort((a, b) => {
            const fullNameA = `${a.last_name} ${a.first_name}`;
            const fullNameB = `${b.last_name} ${b.first_name}`;
            return sortOrder === "asc" ? fullNameA.localeCompare(fullNameB) : fullNameB.localeCompare(fullNameA);
        });

    const handleAddPatient = () => {
        setSelectedPatient(null);
        setIsModalVisible(true);
    };

    const handleEditPatient = (patient) => {
        setSelectedPatient(patient);
        setIsModalVisible(true);
    };

    const handleDeletePatient = async (patient_id) => {
        try {
            await deletePatient(user.token, patient_id);
            await fetchPatients();
            notification.success({
                message: "Пациент удалён",
                description: "Пациент успешно удалён из базы.",
                placement: "topRight",
            });
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка удаления",
                description: "Не удалось удалить пациента.",
                placement: "topRight",
            });
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleModalPatientSubmit = async (newPatient) => {
        try {
            if (selectedPatient) {
                await editPatient(newPatient);
            } else {
                await addNewPatient(newPatient);
            }
            setIsModalVisible(false);
            await fetchPatients();
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка",
                description: error.response?.status === 401
                    ? "Ошибка авторизации: пользователь не найден или токен недействителен"
                    : "Не удалось сохранить данные пациента.",
                placement: "topRight",
            });
        }
    };

    const editPatient = async (patient) => {
        await updatePatient(user.token, selectedPatient.id, patient);
        notification.success({
            message: "Пациент обновлён",
            description: `Данные пациента ${patient.first_name} ${patient.last_name} успешно обновлены.`,
            placement: "topRight",
        });
    };

    const addNewPatient = async (patient) => {
        await addPatient(user.token, patient);
        notification.success({
            message: "Пациент добавлен",
            description: `Пациент ${patient.first_name} ${patient.last_name} успешно добавлен.`,
            placement: "topRight",
        });
    };

    return (
        <div style={{padding: 20}}>
            <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                <Col xs={24} sm={16}>
                    <Input
                        placeholder="Поиск пациента"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{width: "100%"}}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <Tooltip
                        title={"Сортировка пациентов"}
                    >
                        <Select
                            value={sortOrder}
                            onChange={(value) => setSortOrder(value)}
                            style={{width: "100%"}}
                        >
                            <Option value="asc">А-Я</Option>
                            <Option value="desc">Я-А</Option>
                        </Select>
                    </Tooltip>
                </Col>
            </Row>

            {loading ? (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}>
                    <Spin indicator={<LoadingOutlined style={{fontSize: 64, color: "#1890ff"}} spin/>}/>
                </div>
            ) : (
                <List
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 3,
                        xxl: 3,
                    }}
                    dataSource={filteredPatients}
                    renderItem={(patient) => (
                        <List.Item>
                            <PatientListCard
                                patient={patient}
                                handleEditPatient={handleEditPatient}
                                handleDeletePatient={handleDeletePatient}
                            />
                        </List.Item>
                    )}
                    pagination={{
                        current,
                        pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        onChange: (page, newPageSize) => {
                            setCurrent(page);
                            setPageSize(newPageSize);
                        },
                    }}
                />
            )}

            <FloatButton
                icon={<PlusOutlined/>}
                type="primary"
                style={{position: "fixed", bottom: 40, right: 40}}
                onClick={handleAddPatient}
                tooltip="Добавить пациента"
            />

            <PatientFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleModalPatientSubmit}
                patient={selectedPatient}
            />
        </div>
    );
};

export default PatientsPage;
