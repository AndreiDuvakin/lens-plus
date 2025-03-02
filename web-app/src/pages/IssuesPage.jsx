import {notification, Spin, Table, Input, Modal, Row, Col, DatePicker, Tooltip, Button} from "antd";
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

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [startFilterDate, setStartFilterDate] = useState(null);
    const [endFilterDate, setEndFilterDate] = useState(null);

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

    const columns = [
        {
            title: "Дата выдачи",
            dataIndex: "issue_date",
            key: "issue_date",
            render: (text) => new Date(text).toLocaleDateString(),
            sorter: (a, b) => new Date(a.issue_date) - new Date(b.issue_date),
        },
        {
            title: "Пациент",
            dataIndex: "patient",
            key: "patient",
            render: (patient) => `${patient.last_name} ${patient.first_name}`,
        },
        {
            title: "Выдал",
            dataIndex: "doctor",
            key: "doctor",
            render: (doctor) => `${doctor.last_name} ${doctor.first_name}`,
        },
        {
            title: "Линза",
            dataIndex: "lens",
            key: "lens",
            render: (lens) => `Сторона: ${lens.side}, Диаметр: ${lens.diameter}`,
        },
        {
            title: "Действия",
            key: "actions",
            render: (_, issue) => (
                <a onClick={() => setSelectedIssue(issue)}>Подробнее</a>
            ),
        },
    ];

    return (
        <div style={{padding: 20}}>
            <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                <Col xs={24} md={12} sm={24} xl={14}>
                    <Input
                        placeholder="Поиск по пациенту или дате"
                        onChange={handleSearch}
                        style={{marginBottom: 20, width: "100%"}}
                        allowClear
                    />
                </Col>

                <Col xs={24} md={
                    startFilterDate && endFilterDate ? 8 : 12
                } sm={
                    startFilterDate && endFilterDate ? 16 : 24
                } xl={
                    startFilterDate && endFilterDate ? 8 : 10
                }>
                    <Tooltip
                        title="Фильтр по дате выдачи линзы"
                    >
                        <DatePicker.RangePicker
                            style={{width: "100%"}}
                            placeholder={["Дата начала", "Дата окончания"]}
                            format="DD.MM.YYYY"
                            value={[startFilterDate, endFilterDate]}
                            onChange={(dates) => {
                                setStartFilterDate(dates[0]);
                                setEndFilterDate(dates[1]);
                            }}
                        />
                    </Tooltip>
                </Col>
                {startFilterDate && endFilterDate && (
                    <Col xs={24} md={4} sm={8} xl={2}>
                        <Tooltip
                            title="Cбросить фильтр"
                        >
                            <Button
                                onClick={() => {
                                    setStartFilterDate(null);
                                    setEndFilterDate(null);
                                }}
                                style={{marginLeft: 10}}
                                type={"primary"}
                                block
                            >
                                Сбросить
                            </Button>
                        </Tooltip>
                    </Col>
                )}

            </Row>
            {loading ? (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <Spin indicator={<LoadingOutlined style={{fontSize: 64, color: "#1890ff"}} spin/>}/>
                </div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredIssues}
                    rowKey="id"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        onChange: (page, newPageSize) => {
                            setCurrentPage(page);
                            setPageSize(newPageSize);
                        },
                    }}
                    showSorterTooltip={false}
                />
            )}

            <Modal
                open={selectedIssue}
                title="Детали выдачи линзы"
                onCancel={() => setSelectedIssue(null)}
                footer={null}
            >
                {selectedIssue && (
                    <div>
                        <p><b>Дата выдачи:</b> {new Date(selectedIssue.issue_date).toLocaleDateString()}</p>
                        <p><b>Пациент:</b> {selectedIssue.patient.last_name} {selectedIssue.patient.first_name}</p>
                        <p><b>Выдал:</b> {selectedIssue.doctor.last_name} {selectedIssue.doctor.first_name}</p>
                        <p><b>Линза:</b> {selectedIssue.lens.side}, Диаметр: {selectedIssue.lens.diameter}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default IssuesPage;
