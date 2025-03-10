import {
    notification,
    Spin,
    Table,
    Input,
    Row,
    Col,
    DatePicker,
    Tooltip,
    Button,
    FloatButton,
    Typography,
    Timeline, Grid, Pagination
} from "antd";
import getAllLensIssues from "../api/lens_issues/GetAllLensIssues.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../AuthContext.jsx";
import {DatabaseOutlined, LoadingOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import LensIssueViewModal from "../components/lens_issues/LensIssueViewModal.jsx";
import dayjs from "dayjs";
import LensIssueFormModal from "../components/lens_issues/LensIssueFormModal.jsx";
import addLensIssue from "../api/lens_issues/AddLensIssue.jsx";
import SelectViewMode from "../components/SelectViewMode.jsx";

const {Title} = Typography;
const {useBreakpoint} = Grid;

const IssuesPage = () => {
    const {user} = useAuth();
    const screens = useBreakpoint();

    const [loading, setLoading] = useState(true);
    const [lensIssues, setLensIssues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [viewMode, setViewMode] = useState("table");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [timelinePage, setTimelinePage] = useState(1);
    const [timeLinePageSize, setTimeLinePageSize] = useState(10);

    const [startFilterDate, setStartFilterDate] = useState(null);
    const [endFilterDate, setEndFilterDate] = useState(null);

    useEffect(() => {
        fetchLensIssuesWithCache();
        fetchViewModeFromCache();
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

    const fetchViewModeFromCache = () => {
        const cachedViewMode = localStorage.getItem("viewModeIssues");
        if (cachedViewMode) {
            setViewMode(cachedViewMode);
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

    const handleSubmitFormModal = async (issue_date, patient_id, lens_id) => {
        try {
            await addLensIssue(user.token, {issue_date, patient_id, lens_id});
            setIsModalVisible(false);
            notification.success({
                message: "Линза выдана",
                description: "Линза успешно выдана пациенту.",
                placement: "topRight",
            });
            await fetchLensIssues();
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка добавления",
                description: "Не удалось выдать линзу пациенту.",
                placement: "topRight",
            });
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

    const viewModes = [
        {
            value: "table",
            label: "Таблица",
            icon: <DatabaseOutlined style={{marginRight: 8}}/>,
        },
        {
            value: "timeline",
            label: "Лента",
            icon: <UnorderedListOutlined style={{marginRight: 8}}/>,
        },
    ];

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

    const TableView = () => (
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
    );

    const timeLineItems = filteredIssues.map(issue => ({
        label: dayjs(issue.issue_date).format("DD.MM.YYYY"),
        children: (
            <Row
                gutter={[16, 16]}
                align={"middle"}
            >
                <Col xs={24} md={24} sm={24} xl={13}>
                    <p style={{textAlign: "right"}}>Пациент: {issue.patient.last_name} {issue.patient.first_name}</p>
                </Col>
                <Col xs={24} md={24} sm={24} xl={5}>
                    <p style={{textAlign: "right"}}>Линза: {issue.lens.side} {issue.lens.diameter}</p>
                </Col>
                <Col xs={24} md={24} sm={24} xl={6}>
                    <Button
                        type={"dashed"}
                        onClick={() => setSelectedIssue(issue)}
                        style={{marginRight: 40}}
                    >
                        Подробнее
                    </Button>
                </Col>
            </Row>
        ),
    }));

    const TimeLineView = () => {
        const paginatedItems = timeLineItems.slice(
            (timelinePage - 1) * timeLinePageSize,
            timelinePage * timeLinePageSize
        );

        return (
            <>
                <Timeline
                    items={paginatedItems}
                    mode={screens.xs ? "left" : "right"}
                />
                <Row
                    style={{textAlign: "center", marginTop: 20}}
                    align={"middle"}
                    justify={"end"}
                >
                    <Pagination
                        current={timelinePage}
                        pageSize={timeLinePageSize}
                        total={timeLineItems.length}
                        onChange={(page, newPageSize) => {
                            setTimelinePage(page);
                            setTimeLinePageSize(newPageSize);
                        }}
                        showSizeChanger={true}
                        pageSizeOptions={["5", "10", "20", "50"]}
                    />
                </Row>
            </>
        );
    };

    return (
        <div style={{padding: 20}}>
            <Title level={1}><DatabaseOutlined/> Выдача линз</Title>
            <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                <Col xs={24} md={24} sm={24} xl={12}>
                    <Input
                        placeholder="Поиск по пациенту или дате"
                        onChange={handleSearch}
                        style={{width: "100%"}}
                        allowClear
                    />
                </Col>

                <Col xs={24} md={
                    startFilterDate && endFilterDate ? 12 : 16
                } sm={
                    16
                } xl={
                    startFilterDate && endFilterDate ? 6 : 8
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
                                type={"primary"}
                                block
                            >
                                Сбросить
                            </Button>
                        </Tooltip>
                    </Col>
                )}
                <Col xs={24}
                     md={startFilterDate && endFilterDate ? 8 : 8}
                     sm={startFilterDate && endFilterDate ? 24 : 8}
                     xl={4}>
                    <SelectViewMode
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        localStorageKey={"viewModeIssues"}
                        toolTipText={"Формат отображения выдач линз"}
                        viewModes={viewModes}
                    />
                </Col>
            </Row>
            {loading ? (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <Spin indicator={<LoadingOutlined style={{fontSize: 64, color: "#1890ff"}} spin/>}/>
                </div>
            ) : viewMode === "table" ? (
                <TableView/>
            ) : (
                <TimeLineView/>
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
