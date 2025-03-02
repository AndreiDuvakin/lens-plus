import {notification, Spin, Timeline, Input, Modal, Button} from "antd";
import getAllLensIssues from "../api/lens_issues/GetAllLensIssues.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../AuthContext.jsx";
import {LoadingOutlined} from "@ant-design/icons";

const IssuesPage = () => {
    const {user} = useAuth();

    const [loading, setLoading] = useState(true);
    const [lensIssues, setLensIssues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchLensIssuesWithCache();
    }, []);

    useEffect(() => {
        const interval = setInterval(fetchLensIssues, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const fetchLensIssuesWithCache = async () => {
        const cachedData = localStorage.getItem("lensIssuesData");
        const cacheTimestamp = localStorage.getItem("lensIssuesTimestamp");

        if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 60 * 1000) {
            setLensIssues(JSON.parse(cachedData));
            setLoading(false);
        } else {
            await fetchLensIssues();
        }
    };

    const fetchLensIssues = async () => {
        try {
            const data = await getAllLensIssues(user.token);
            setLensIssues(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка загрузки данных",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredIssues = lensIssues.filter(issue =>
        issue.patient.first_name.toLowerCase().includes(searchTerm) ||
        issue.patient.last_name.toLowerCase().includes(searchTerm) ||
        new Date(issue.issue_date).toLocaleDateString().includes(searchTerm)
    );

    return (
        <div style={{padding: 20}}>
            <Input.Search
                placeholder="Поиск по пациенту или дате"
                onChange={handleSearch}
                style={{marginBottom: 20, width: 300}}
            />

            {loading ? (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <Spin indicator={<LoadingOutlined style={{fontSize: 64, color: "#1890ff"}} spin/>}/>
                </div>
            ) : (
                <Timeline
                    items={filteredIssues.map((issue) => (
                        {
                            key: issue.id,
                            label: new Date(issue.issue_date).toLocaleDateString(),
                            children: (
                                <div>
                                    <p><b>Дата выдачи:</b> {new Date(issue.issue_date).toLocaleDateString()}</p>
                                    <p><b>Пациент:</b> {issue.patient.last_name} {issue.patient.first_name}</p>
                                    <p><b>Врач:</b> {issue.doctor.last_name} {issue.doctor.first_name}</p>
                                    <p><b>Линза:</b> {issue.lens.side}, Диаметр: {issue.lens.diameter}</p>
                                    <Button type="link" onClick={() => setSelectedIssue(issue)}>Подробнее</Button>
                                </div>
                            ),
                        }
                    ))}
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

            <Modal
                visible={!!selectedIssue}
                title="Детали выдачи линзы"
                onCancel={() => setSelectedIssue(null)}
                footer={null}
            >
                {selectedIssue && (
                    <div>
                        <p><b>Дата выдачи:</b> {new Date(selectedIssue.issue_date).toLocaleDateString()}</p>
                        <p><b>Пациент:</b> {selectedIssue.patient.last_name} {selectedIssue.patient.first_name}</p>
                        <p><b>Врач:</b> {selectedIssue.doctor.last_name} {selectedIssue.doctor.first_name}</p>
                        <p><b>Линза:</b> {selectedIssue.lens.side}, Диаметр: {selectedIssue.lens.diameter}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default IssuesPage;
