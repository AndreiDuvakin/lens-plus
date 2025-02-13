import {useEffect, useState} from "react";
import {Input, Select, List, FloatButton, Row, Col, Spin} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {useAuth} from "../AuthContext.jsx";
import getAllPatients from "../api/patients/GetAllPatients.jsx";
import PatientListCard from "../components/PatientListCard.jsx";
import PatientModal from "../components/PatientModal.jsx";
import updatePatient from "../api/patients/UpdatePatient.jsx";
import addPatient from "../api/patients/AddPatient.jsx";
import deletePatient from "../api/patients/DeletePatient.jsx"; // Подключаем модальное окно

const {Option} = Select;

const PatientsPage = () => {
    const {user} = useAuth();
    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isModalVisible) {
            const intervalId = setInterval(fetchPatients, 5000);
            return () => clearInterval(intervalId);
        }
    }, [user, isModalVisible]);


    const fetchPatients = async () => {
        if (!user || !user.token) return;

        try {
            const data = await getAllPatients(user.token);
            setPatients(data);
        } catch (err) {
            setError(err.message);
        }

        if (loading) {
            setLoading(false)
        }
    };

    const filteredPatients = patients
        .filter((patient) => `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchText.toLowerCase()))
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
        if (!user || !user.token) return;

        try {
            await deletePatient(user.token, patient_id);
            await fetchPatients();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleModalPatientSubmit = async (newPatient) => {
        if (selectedPatient) {

            try {
                await updatePatient(user.token, selectedPatient.id, newPatient);
            } catch (error) {
                if (error.response?.status === 401) {
                    throw new Error("Ошибка авторизации: пользователь неяден или токен недействителен");
                }
                throw new Error(error.message);
            }

        }

        if (!selectedPatient) {

            try {
                await addPatient(user.token, newPatient);
            } catch (error) {
                if (error.response?.status === 401) {
                    throw new Error("Ошибка авторизации: пользователь неяден или токен недействителен");
                }
                throw new Error(error.message);
            }

        }

        setIsModalVisible(false);
        await fetchPatients();
    };

    return (<div style={{padding: 20}}>
        <Row gutter={[16, 16]} style={{marginBottom: 20}}>
            <Col xs={24} sm={16}>
                <Input
                    placeholder="Поиск пациента"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{width: "100%"}}
                />
            </Col>
            <Col xs={24} sm={8}>
                <Select
                    value={sortOrder}
                    onChange={(value) => setSortOrder(value)}
                    style={{width: "100%"}}
                >
                    <Option value="asc">А-Я</Option>
                    <Option value="desc">Я-А</Option>
                </Select>
            </Col>
        </Row>

        {loading ? (
            <Spin indicator={<LoadingOutlined style={{fontSize: 48}} spin/>}/>
        ) : (
            <List
                grid={{gutter: 16, column: 1}}
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
                }}
            />
        )}


        <FloatButton
            icon={<PlusOutlined/>}
            style={{position: "fixed", bottom: 20, right: 20}}
            onClick={handleAddPatient}
        />

        <PatientModal
            visible={isModalVisible}
            onCancel={handleCancel}
            onSubmit={handleModalPatientSubmit}
            patient={selectedPatient}
        />
    </div>);
};

export default PatientsPage;
