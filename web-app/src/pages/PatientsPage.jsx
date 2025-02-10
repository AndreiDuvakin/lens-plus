import { useEffect, useState } from "react";
import { Input, Select, List, FloatButton, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../AuthContext.jsx";
import getAllPatients from "../api/GetAllPatients.jsx";
import PatientListCard from "../components/PatientListCard.jsx";

const { Option } = Select;

const PatientsPage = () => {
    const { user } = useAuth();
    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            if (!user || !user.token) return;

            try {
                const data = await getAllPatients(user.token);
                setPatients(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchPatients();
    }, [user]);

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

    return (
        <div style={{ padding: 20 }}>
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
                <Col xs={24} sm={16}>
                    <Input
                        placeholder="Поиск пациента"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: "100%" }}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <Select
                        value={sortOrder}
                        onChange={(value) => setSortOrder(value)}
                        style={{ width: "100%" }}
                    >
                        <Option value="asc">А-Я</Option>
                        <Option value="desc">Я-А</Option>
                    </Select>
                </Col>
            </Row>

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={filteredPatients}
                renderItem={(patient) => (
                    <List.Item>
                        <PatientListCard patient={patient} />
                    </List.Item>
                )}
            />

            <FloatButton
                icon={<PlusOutlined />}
                style={{ position: "fixed", bottom: 20, right: 20 }}
                onClick={() => console.log("Добавить пациента")}
            />
        </div>
    );
};

export default PatientsPage;
