import {notification, Spin, Table, Input, Row, Col, DatePicker, Tooltip, Button, FloatButton, Typography} from "antd";
import getAllLensIssues from "../api/lens_issues/GetAllLensIssues.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../AuthContext.jsx";
import {DatabaseOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import LensIssueViewModal from "../components/lens_issues/LensIssueViewModal.jsx";
import dayjs from "dayjs";
import LensIssueFormModal from "../components/lens_issues/LensIssueFormModal.jsx";

const {Title} = Typography;

const IssuesPage = () => {
    const {user} = useAuth();

    const [loading, setLoading] = useState(true);
    const [lensIssues, setLensIssues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [startFilterDate, setStartFilterDate] = useState(null);
    const [endFilterDate, setEndFilterDate] = useState(null);

    useEffect(() => {
        fetchLensIssuesWithCache();
        document.title = "Выдача линз";
    }, []);

    useEffect(() => {
        if (!isModalVisible) {
            const intervalId = setInterval(fetchLensIssues, 5000);
            return () => clearInterval(intervalId);
        }
    }, [user, isModalVisible]);

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

    const handleAddIssue = () => {
        setSelectedIssue(null);
        setIsModalVisible(true);
    };

    const handleCloseViewModal = () => {
        setSelectedIssue(null);
    };

    const handleCloseFormModal = () => {
        setIsModalVisible(false);
    };

    const handleSubmitFormModal = () => {

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


    const filteredIssues = lensIssues.filter(issue => {
            let dateFilter = true;

            if (startFilterDate && endFilterDate) {
                const issueDate = dayjs(issue.issue_date);

                dateFilter = issueDate.isAfter(startFilterDate) && issueDate.isBefore(endFilterDate);
            }

            return (
                (
                    issue.patient.last_name.toLowerCase().includes(searchTerm) ||
                    issue.patient.first_name.toLowerCase().includes(searchTerm) ||
                    issue.doctor.last_name.toLowerCase().includes(searchTerm) ||
                    issue.doctor.first_name.toLowerCase().includes(searchTerm)
                ) &&
                dateFilter
            )
        }
    );

    const columns = [
        {
            title: "Дата выдачи",
            dataIndex: "issue_date",
            key: "issue_date",
            render: (text) => new Date(text).toLocaleDateString(),
            sorter: (a, b) => new Date(b.issue_date) - new Date(a.issue_date),
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
                <Button type={"link"} onClick={() => setSelectedIssue(issue)}>Подробнее</Button>
            ),
        },
    ];

    return (
        <div style={{padding: 20}}>
            <Title level={1}><DatabaseOutlined/> Выдача линз</Title>
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

            <FloatButton
                icon={<PlusOutlined/>}
                type={"primary"}
                style={{position: "fixed", bottom: 40, right: 40}}
                onClick={handleAddIssue}
                tooltip={"Добавить выдачу линзы"}
            />

            <LensIssueFormModal
                visible={isModalVisible}
                onCancel={handleCloseFormModal}
                onSubmit={handleSubmitFormModal}
            />

            <LensIssueViewModal
                visible={selectedIssue !== null}
                onCancel={handleCloseViewModal}
                lensIssue={selectedIssue}
            />
        </div>
    );
};

export default IssuesPage;
