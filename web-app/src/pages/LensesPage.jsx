import {useState, useEffect} from "react";
import {
    Input,
    Select,
    List,
    FloatButton,
    Row,
    Col,
    Spin,
    Button,
    Form,
    InputNumber,
    Card, Grid, notification, Dropdown, Table, Popconfirm
} from "antd";
import {LoadingOutlined, PlusOutlined, DownOutlined, UpOutlined} from "@ant-design/icons";
import LensCard from "../components/lenses/LensListCard.jsx";
import getAllLenses from "../api/lenses/GetAllLenses.jsx";
import addLens from "../api/lenses/AddLens.jsx";
import updateLens from "../api/lenses/UpdateLens.jsx";
import deleteLens from "../api/lenses/DeleteLens.jsx";
import {useAuth} from "../AuthContext.jsx";
import LensFormModal from "../components/lenses/LensFormModal.jsx";

const {Option} = Select;
const {useBreakpoint} = Grid;

const LensesPage = () => {
    const {user} = useAuth();
    const screens = useBreakpoint();

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [searchText, setSearchText] = useState("");
    const [viewMode, setViewMode] = useState("tile");
    const [lenses, setLenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLens, setSelectedLens] = useState(null);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

    const [searchParams, setSearchParams] = useState({
        tor: null,
        diameter: null,
        preset_refraction: null,
        periphery_toricity: null,
        side: 'all',
        issued: false,
        trial: null
    });

    useEffect(() => {
        fetchLensWithCache();
    }, []);

    useEffect(() => {
        if (!isModalVisible) {
            const intervalId = setInterval(fetchLenses, 5000);
            return () => clearInterval(intervalId);
        }
    }, [user, isModalVisible]);

    const fetchLensWithCache = async () => {
        const cachedData = localStorage.getItem("lensData");
        const cacheTimestamp = localStorage.getItem("lensTimestamp");

        if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 60 * 1000) {
            setLenses(JSON.parse(cachedData));
            setLoading(false);
            return;
        }

        await fetchLenses();
    };

    const fetchLenses = async () => {
        if (!user || !user.token) return;

        try {
            const data = await getAllLenses(user.token);
            setLenses(data);
            setLoading(false);
        } catch (error) {
            console.error("Ошибка загрузки линз:", error);
            notification.error({
                message: "Ошибка загрузки линз",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            })
            setLoading(false);
        }
    };

    const filteredLenses = lenses.filter((lens) => {
        const textMatch = Object.values(lens).some((value) =>
            value?.toString().toLowerCase().includes(searchText.toLowerCase())
        );

        const advancedMatch = Object.entries(searchParams).every(([key, value]) => {
            if (value === null || value === '') return true;
            if (key === 'side') {
                if (value === 'all') return true;
                return lens.side === value;
            }
            if (key === 'issued') {
                return lens.issued === value || value === "all";
            }
            return lens[key] === value;
        });

        return textMatch && advancedMatch && (searchParams.issued || lens.issued === false);
    }).sort((a, b) => {
        return a.preset_refraction - b.preset_refraction;
    });


    const handleAddLens = () => {
        setSelectedLens(null);
        setIsModalVisible(true);
    };

    const handleEditLens = (lens) => {
        setSelectedLens(lens);
        setIsModalVisible(true);
    };

    const handleDeleteLens = async (lensId) => {
        try {
            await deleteLens(user.token, lensId);
            await fetchLenses(user.token);
            notification.success({
                message: "Линза удалена",
                description: "Линза успешно удалена.",
                placement: "topRight",
            })
        } catch (error) {
            console.error("Ошибка удаления линзы:", error);
            notification.error({
                message: "Ошибка удаления линзы",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    };

    const handleModalSubmit = async (lensData) => {
        try {
            if (selectedLens) {
                await updateLens(user.token, selectedLens.id, lensData);
                notification.success({
                    message: "Линза обновлена",
                    description: "Линза успешно обновлена.",
                    placement: "topRight",
                });
            } else {
                await addLens(user.token, lensData);
                notification.success({
                    message: "Линза добавлена",
                    description: "Линза успешно добавлена.",
                    placement: "topRight",
                });
            }
            setIsModalVisible(false);
            await fetchLenses();
        } catch (error) {
            console.error("Ошибка сохранения линзы:", error);
            notification.error({
                message: "Ошибка сохранения линзы",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    };

    const toggleAdvancedSearch = () => {
        setShowAdvancedSearch(!showAdvancedSearch);
    };

    const handleParamChange = (param, value) => {
        setSearchParams({...searchParams, [param]: value});
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const TileView = () => (
        <List
            grid={{gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4}}
            dataSource={filteredLenses}
            renderItem={(lens) => (
                <List.Item>
                    <LensCard
                        lens={lens}
                        handleDeleteLens={() => handleDeleteLens(lens.id)}
                        handleEditLens={() => handleEditLens(lens)}
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
    );


    const columns = [
        {
            title: "Тор",
            dataIndex: "tor",
            key: "tor",
            sorter: (a, b) => a.tor - b.tor,
        },
        {
            title: "Диаметр",
            dataIndex: "diameter",
            key: "diameter",
            sorter: (a, b) => a.diameter - b.diameter,
        },
        {
            title: "Пресетная рефракция",
            dataIndex: "preset_refraction",
            key: "preset_refraction",
            sorter: (a, b) => a.preset_refraction - b.preset_refraction,
        },
        {
            title: "Периферия торичность",
            dataIndex: "periphery_toricity",
            key: "periphery_toricity",
            sorter: (a, b) => a.periphery_toricity - b.periphery_toricity,
        },
        {
            title: "FVC",
            dataIndex: "fvc",
            key: "fvc",
            sorter: (a, b) => a.fvc - b.fvc,
        },
        {
            title: "Trial",
            dataIndex: "trial",
            key: "trial",
            sorter: (a, b) => a.trial - b.trial,
        },
        {
            title: "Сторона",
            dataIndex: "side",
            key: "side",
            filters: [
                {text: "Левая", value: "левая"},
                {text: "Правая", value: "правая"},
            ],
            onFilter: (value, record) => record.side === value,
        },
        {
            title: "Выдана",
            dataIndex: "issued",
            key: "issued",
            render: (issued) => (issued ? "Да" : "Нет"),
            filters: [
                {text: "Да", value: true},
                {text: "Нет", value: false},
            ],
            onFilter: (value, record) => record.issued === value,
        },
        {
            title: "Действия",
            key: "actions",
            fixed: 'right',
            render: (text, record) => (
                <div style={{display: "flex", gap: "8px"}}>
                    <Button onClick={() => handleEditLens(record)}>Изменить</Button>

                    <Popconfirm
                        title="Вы уверены, что хотите удалить линзу?"
                        onConfirm={() => handleDeleteLens(record.id)}
                        okText="Да, удалить"
                        cancelText="Отмена"
                    >
                        <Button danger>Удалить</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const TableView = () => (
        <Table
            columns={columns}
            dataSource={filteredLenses}
            scroll={{
                x: "max-content"
            }}
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
    );


    return (
        <div style={{padding: 20}}>
            <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                <Col xs={24} md={14} sm={10} xl={16}>
                    <Input
                        placeholder="Поиск линзы"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{width: "100%"}}
                        allowClear
                    />
                </Col>
                <Col xs={24} md={7} sm={10} xl={4}>
                    <Button
                        onClick={toggleAdvancedSearch} icon={showAdvancedSearch ? <UpOutlined/> : <DownOutlined/>}
                        block
                    >
                        Расширенный поиск
                    </Button>
                </Col>
                <Col xs={24} md={3} sm={4} xl={2}>
                    <Select
                        value={viewMode}
                        onChange={(value) => setViewMode(value)}
                        style={{width: "100%"}}
                    >
                        <Option value={"tile"}>Плиткой</Option>
                        <Option value={"table"}>Таблицей</Option>
                    </Select>
                </Col>
            </Row>

            {showAdvancedSearch && (
                <Card
                    title="Расширенный поиск"
                    style={{
                        marginBottom: 20,
                        boxShadow: "0 1px 6px rgba(0, 0, 0, 0.15)",
                        borderRadius: 8
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form layout="vertical">
                                <Form.Item label="Тор">
                                    <InputNumber
                                        value={searchParams.tor || 0}
                                        onChange={(value) => handleParamChange("tor", value)}
                                        style={{width: "100%"}}
                                        defaultValue={0}
                                        step={0.1}
                                    />
                                </Form.Item>

                                <Form.Item label="Диаметр">
                                    <InputNumber
                                        value={searchParams.diameter || 0}
                                        onChange={(value) => handleParamChange("diameter", value)}
                                        style={{width: "100%"}}
                                        defaultValue={0}
                                        step={0.1}
                                    />
                                </Form.Item>

                                <Form.Item label="Рефракция">
                                    <InputNumber
                                        value={searchParams.preset_refraction || 0}
                                        onChange={(value) => handleParamChange("preset_refraction", value)}
                                        style={{width: "100%"}}
                                        defaultValue={0}
                                        step={0.1}
                                    />
                                </Form.Item>

                                <Form.Item label="Периферическая торичность">
                                    <InputNumber
                                        value={searchParams.periphery_toricity || 0}
                                        onChange={(value) => handleParamChange("periphery_toricity", value)}
                                        style={{width: "100%"}}
                                        defaultValue={0}
                                        step={0.1}
                                    />
                                </Form.Item>
                            </Form>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form layout="vertical">
                                <Form.Item label="Сторона">
                                    <Select
                                        value={searchParams.side}
                                        onChange={(value) => handleParamChange("side", value)}
                                        style={{width: "100%"}}
                                    >
                                        <Option value="all">Все</Option>
                                        <Option value="левая">Левая</Option>
                                        <Option value="правая">Правая</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Выдана">
                                    <Select
                                        value={searchParams.issued}
                                        onChange={(value) => handleParamChange("issued", value)}
                                        style={{width: "100%"}}
                                    >
                                        <Option value="all">Все</Option>
                                        <Option value={true}>Да</Option>
                                        <Option value={false}>Нет</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item label="Острота зрения (Trial)">
                                    <InputNumber
                                        value={searchParams.trial || 0}
                                        onChange={(value) => handleParamChange("trial", value)}
                                        style={{width: "100%"}}
                                        defaultValue={0}
                                        step={0.1}
                                    />
                                </Form.Item>

                                <Row>
                                    <Col xs={24} sm={12} offset={screens.sm ? 12 : 0}
                                         style={{textAlign: screens.sm ? "right" : "center", marginTop: "1.7rem"}}>
                                        <Button
                                            type="primary"
                                            block={!screens.sm}
                                            onClick={() => {
                                                setSearchParams({
                                                    tor: null,
                                                    diameter: null,
                                                    preset_refraction: null,
                                                    periphery_toricity: null,
                                                    side: 'all',
                                                    issued: false,
                                                    trial: null
                                                });
                                            }}
                                        >
                                            Сбросить
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            )}

            {loading ? (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
                    <Spin indicator={<LoadingOutlined style={{fontSize: 64, color: "#1890ff"}} spin/>}/>
                </div>
            ) : viewMode === "tile" ? (
                <TileView/>
            ) : (
                <TableView/>
            )}

            <FloatButton
                icon={<PlusOutlined/>}
                type="primary"
                style={{position: "fixed", bottom: 40, right: 40}}
                onClick={handleAddLens}
                tooltip="Добавить линзу"
            />

            <LensFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleModalSubmit}
                lens={selectedLens}
            />
        </div>
    );
};

export default LensesPage;