import {useEffect, useState} from "react";
import {Input, Select, List, Card, Button, FloatButton} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useAuth} from "../AuthContext.jsx";
import getAllPatients from "../api/GetAllPatients.jsx";
import PatientListCard from "../components/PatientListCard.jsx";

const {Search} = Input;
const {Option} = Select;

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
            return sortOrder === "asc" ? fullNameA.localeCompare(fullNameB) : fullNameB.localeCompare(fullNameA);
        });

    return (
        <div style={{padding: 20}}>
            <div style={{display: "flex", gap: 10, marginBottom: 20}}>
                <Search
                    placeholder="Поиск пациента"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{flex: 1}}
                />
                <Select
                    value={sortOrder}
                    onChange={(value) => setSortOrder(value)}
                    style={{width: 150}}
                >
                    <Option value="asc">А-Я</Option>
                    <Option value="desc">Я-А</Option>
                </Select>
            </div>

            <List
                grid={{gutter: 16, column: 1}}
                dataSource={filteredPatients}
                renderItem={(patient) => (
                    <List.Item>
                        <PatientListCard patient={patient}/>
                    </List.Item>
                )}
            />

            <FloatButton
                icon={<PlusOutlined/>}
                style={{position: "fixed", bottom: 20, right: 20}}
                onClick={() => console.log("Добавить пациента")}
            />
        </div>
    );
};

export default PatientsPage;
