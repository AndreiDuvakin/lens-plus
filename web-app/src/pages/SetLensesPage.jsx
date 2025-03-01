import {useAuth} from "../AuthContext.jsx";
import {useEffect, useState} from "react";
import {FloatButton, Input, List, notification, Row, Spin} from "antd";
import getAllSets from "../api/sets/GetAllSets.jsx";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import SetListCard from "../components/sets/SetListCard.jsx";
import SetFormModal from "../components/sets/SetFormModal.jsx";
import updateSet from "../api/sets/UpdateSet.jsx";
import addSet from "../api/sets/AddSet.jsx";
import deleteSet from "../api/sets/DeleteSet.jsx";
import addSetContent from "../api/set_content/AddSetContent.jsx";
import updateSetContent from "../api/set_content/UpdateSetContent.jsx";
import appendLensesFromSet from "../api/sets/AppendLensesFromSet.jsx";


const SetLensesPage = () => {
    const {user} = useAuth();

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [searchText, setSearchText] = useState("");
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSet, setSelectedSet] = useState(null);

    useEffect(() => {
        fetchSetsWithCache();
    }, []);

    useEffect(() => {
        if (!isModalVisible) {
            const intervalId = setInterval(fetchSets, 5000);
            return () => clearInterval(intervalId);
        }
    }, [user, isModalVisible]);

    const fetchSetsWithCache = async () => {
        const cachedData = localStorage.getItem("setsData");
        const cacheTimestamp = localStorage.getItem("setsTimestamp");

        if (cachedData && cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < 60 * 1000) {
            setSets(JSON.parse(cachedData));
            setLoading(false);
        } else {
            await fetchSets();
        }
    };

    const fetchSets = async () => {
        if (!user || !user.token) return;

        try {
            const data = await getAllSets(user.token);
            setSets(data);

            localStorage.setItem("setsData", JSON.stringify(data));
            localStorage.setItem("setsTimestamp", Date.now().toString());
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка загрузки данных",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            })
        }

        if (loading) {
            setLoading(false);
        }
    };

    const filteredSets = sets.filter(set => set.title.toLowerCase().includes(searchText.toLowerCase()));

    const handleAddSet = () => {
        setSelectedSet(null);
        setIsModalVisible(true);
    };

    const handleEditSet = (set) => {
        setSelectedSet(set);
        setIsModalVisible(true);
    }

    const handleDeleteSet = async (set_id) => {
        try {
            await deleteSet(user.token, set_id);
            notification.success({
                message: "Набор удален",
                description: "Набор успешно удален.",
                placement: "topRight",
            });
            await fetchSets();
        } catch (error) {
            console.error("Ошибка удаления набора:", error);
            notification.error({
                message: "Ошибка удаления набора",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleAppendSet = async (set) => {
        try {
            await appendLensesFromSet(user.token, set.id);
            notification.success({
                message: "Линзы добавлены",
                description: "Линзы успешно добавлены.",
                placement: "topRight",
            });
        } catch (error) {
            console.error("Ошибка добавления линз:", error);
            notification.error({
                message: "Ошибка добавления линз",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    };

    const handleModalSetSubmit = async (set, content = []) => {
        try {
            let refreshed_set;

            if (selectedSet) {
                refreshed_set = await editCurrentSet(set);
            } else {
                refreshed_set = await addNewSet(set);
            }

            if (refreshed_set && selectedSet) {
                await updateContent(content, refreshed_set.id);
            } else if (refreshed_set && !selectedSet) {
                await setContent(content, refreshed_set.id);
            }

            setIsModalVisible(false);
            await fetchSets();
        } catch (error) {
            console.error("Ошибка сохранения набора:", error);
            notification.error({
                message: "Ошибка сохранения набора",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    };

    const setContent = async (content, set_id) => {
        try {
            console.log(content);
            await addSetContent(user.token, content, set_id);
        } catch (error) {
            console.error("Ошибка сохранения набора:", error);
            notification.error({
                message: "Ошибка сохранения набора",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    };

    const updateContent = async (content, set_id) => {
        try {
            await updateSetContent(user.token, content, set_id);
        } catch (error) {
            console.error("Ошибка сохранения набора:", error);
            notification.error({
                message: "Ошибка сохранения набора",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    };

    const editCurrentSet = async (set) => {
        const refreshed_set = await updateSet(user.token, selectedSet.id, set);
        notification.success({
            message: "Набор обновлен",
            description: "Набор успешно обновлен.",
            placement: "topRight",
        });
        return refreshed_set;
    };

    const addNewSet = async (set) => {
        const refreshed_set = await addSet(user.token, set);
        notification.success({
            message: "Набор добавлен",
            description: "Набор успешно добавлен.",
            placement: "topRight",
        });
        return refreshed_set;
    };

    return (
        <div style={{padding: 20}}>
            <Row style={{marginBottom: 20}}>
                <Input
                    placeholder="Поиск набора"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{width: "100%"}}
                    allowClear
                />
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
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 3,
                        xxl: 3,
                    }}
                    dataSource={filteredSets}
                    renderItem={(set) => (
                        <List.Item>
                            <SetListCard
                                set={set}
                                handleEditSet={handleEditSet}
                                handleDeleteSet={handleDeleteSet}
                                handleAppendSet={handleAppendSet}
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
                type="primary"
                style={{position: "fixed", bottom: 40, right: 40}}
                tooltip="Добавить набор"
                onClick={handleAddSet}
            />

            <SetFormModal
                visible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleModalSetSubmit}
                setData={selectedSet}
            />
        </div>
    );
};

export default SetLensesPage;