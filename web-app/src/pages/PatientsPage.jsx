import {useEffect, useState} from "react";
import {Input, Select, List, FloatButton, Row, Col, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useAuth} from "../AuthContext.jsx";
import getAllPatients from "../api/patients/GetAllPatients.jsx";
import PatientListCard from "../components/PatientListCard.jsx";
import PatientModal from "../components/PatientModal.jsx";
import updatePatient from "../api/patients/UpdatePatient.jsx"; // Подключаем модальное окно

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
        };

        const filteredPatients = patients
            .filter((patient) =>
                `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchText.toLowerCase())
            )
            .sort((a, b) => {
                const fullNameA = `${a.last_name} ${a.first_name}`;
                const fullNameB = `${b.last_name} ${b.first_name}`;
                return sortOrder === "asc"
                    ? fullNameA.localeCompare(fullNameB)
                    : fullNameB.localeCompare(fullNameA);
            });

        const handleAddPatient = () => {
            setSelectedPatient(null);
            setIsModalVisible(true);
        };

        const handleEditPatient = (patient) => {
            setSelectedPatient(patient);
            setIsModalVisible(true);
        };

        const handleCancel = () => {
            setIsModalVisible(false);
        };

        const handleSubmit = async (newPatient) => {
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
                setPatients((prevPatients) => [...prevPatients, {id: Date.now(), ...newPatient}]);
                message.success("Пациент успешно добавлен!");
            }

            setIsModalVisible(false);
        };

        return (
            <div style={{padding: 20}}>
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

                <List
                    grid={{gutter: 16, column: 1}}
                    dataSource={filteredPatients}
                    renderItem={(patient) => (
                        <List.Item
                            onClick={() => {
                                handleEditPatient(patient);
                            }}
                        >
                            <PatientListCard patient={patient}/>
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

                <FloatButton
                    icon={<PlusOutlined/>}
                    style={{position: "fixed", bottom: 20, right: 20}}
                    onClick={handleAddPatient}
                />

                <PatientModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSubmit={handleSubmit}
                    patient={selectedPatient}
                />
            </div>
        );
    }
;

export default PatientsPage;
