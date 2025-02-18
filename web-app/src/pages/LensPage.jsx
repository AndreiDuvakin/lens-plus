import {useState, useEffect} from "react";
import {Input, Select, List, FloatButton, Row, Col, Spin, Checkbox} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import LensCard from "../components/lenses/LensListCard.jsx";
import getAllLenses from "../api/lenses/GetAllLenses.jsx";
import addLens from "../api/lenses/AddLens.jsx";
import updateLens from "../api/lenses/UpdateLens.jsx";
import deleteLens from "../api/lenses/DeleteLens.jsx";
import {useAuth} from "../AuthContext.jsx";

const {Option} = Select;

const LensesPage = () => {
    const {user} = useAuth();

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [searchText, setSearchText] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [lenses, setLenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showIssuedLenses, setShowIssuedLenses] = useState(false);
    const [selectedLens, setSelectedLens] = useState(null);


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
            setLoading(false);
        }
    };

    const filteredLenses = lenses.filter((lens) =>
        Object.values(lens).some((value) =>
            value?.toString().toLowerCase().includes(searchText.toLowerCase())
        ) &&
        (showIssuedLenses || lens.issued === false)
    ).sort((a, b) => {
        return sortOrder === "asc"
            ? a.preset_refraction - b.preset_refraction
            : b.preset_refraction - a.preset_refraction;
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
        if (!user || !user.token) return;

        try {
            await deleteLens(lensId, user.token);
            fetchLenses(user.token);
        } catch (error) {
            console.error("Ошибка удаления линзы:", error);
        }
    };

    const handleModalSubmit = async (lensData) => {
        try {
            if (selectedLens) {
                await updateLens(selectedLens.id, lensData);
            } else {
                await addLens(lensData);
            }
            setIsModalVisible(false);
            fetchLenses();
        } catch (error) {
            console.error("Ошибка сохранения линзы:", error);
        }
    };

    return (
        <div style={{padding: 20}}>
            <Row gutter={[16, 16]} style={{marginBottom: 20}}>
                <Col xs={24} sm={12}>
                    <Input
                        placeholder="Поиск линзы"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{width: "100%"}}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <Select
                        value={sortOrder}
                        onChange={(value) => setSortOrder(value)}
                        style={{width: "100%"}}
                    >
                        <Option value="asc">По возрастанию рефракции</Option>
                        <Option value="desc">По убыванию рефракции</Option>
                    </Select>
                </Col>
                <Col xs={24} sm={4}>
                    <Checkbox
                        onChange={(e) => {
                            setShowIssuedLenses(e.target.checked);
                        }}
                    >
                        Показать выданные
                    </Checkbox>
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
            )}

            <FloatButton
                icon={<PlusOutlined/>}
                style={{position: "fixed", bottom: 20, right: 20}}
                onClick={handleAddLens}
            />

            {/*<LensModal*/}
            {/*    visible={isModalVisible}*/}
            {/*    onCancel={() => setIsModalVisible(false)}*/}
            {/*    onSubmit={handleModalSubmit}*/}
            {/*    lens={selectedLens}*/}
            {/*/>*/}
        </div>
    );
};

export default LensesPage;
