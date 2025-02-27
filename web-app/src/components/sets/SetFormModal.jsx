import {useState, useEffect} from "react";
import {Modal, Button, Form, Input, Table, InputNumber, Select, Space, notification} from "antd";
import {PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import axios from "axios";
import getAllLensTypes from "../../api/lens_types/GetAllLensTypes.jsx";
import {useAuth} from "../../AuthContext.jsx";
import PropTypes from "prop-types";
import getSetContentBySetId from "../../api/set_content/GetSetContentBySetId.jsx";

const {Option} = Select;

const SetFormModal = ({visible, onCancel, setData, onSubmit}) => {
    const {user} = useAuth();

    const [form] = Form.useForm();
    const [content, setContent] = useState([]);
    const [lensTypes, setLensTypes] = useState([]);

    useEffect(() => {
        fetchLensTypes();
        fetchSetContents();
    }, []);

    useEffect(() => {
        if (setData) {
            form.setFieldsValue({title: setData.title || ""});
        }
        fetchSetContents();
    }, [setData, form]);


    const fetchSetContents = async () => {
        if (!setData) return;

        try {
            const data = await getSetContentBySetId(user.token, setData.id);
            setContent(data);
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка загрузки контента",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    };

    const fetchLensTypes = async () => {
        try {
            const data = await getAllLensTypes(user.token);
            setLensTypes(data);
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Ошибка загрузки типов линз",
                description: "Проверьте подключение к сети.",
                placement: "topRight",
            });
        }
    };

    const addContentItem = () => {
        setContent([...content, {
            id: Date.now(),
            tor: 0,
            trial: 0,
            esa: 0,
            fvc: 0,
            preset_refraction: 0,
            diameter: 0,
            periphery_toricity: 0,
            side: "левая",
            count: 1,
            type_id: null
        }]);
    };

    const validateContent = () => {
        for (const item of content) {
            if (
                item.tor === null ||
                item.trial === null ||
                item.esa === null ||
                item.fvc === null ||
                item.preset_refraction === null ||
                item.diameter === null ||
                item.periphery_toricity === null ||
                item.side === null ||
                item.count === null ||
                item.type_id === null
            ) {
                notification.error({
                    message: "Ошибка валидации",
                    description: "Все поля в таблице должны быть заполнены перед сохранением.",
                    placement: "topRight",
                });
                return false;
            }
        }
        return true;
    };

    const updateContentItem = (index, field, value) => {
        const updated = [...content];
        updated[index][field] = value;
        setContent(updated);
    };

    const removeContentItem = (index) => {
        setContent(content.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            if (!validateContent()) return;
            onSubmit({...values}, content);
        });
    };

    const columns = [
        {
            title: "Tor",
            dataIndex: "tor",
            render: (_, record, index) => <InputNumber
                step={0.1}
                value={record.tor}
                onChange={value => updateContentItem(index, "tor", value)}
            />,
        },
        {
            title: "Trial",
            dataIndex: "trial",
            render: (_, record, index) => <InputNumber
                step={0.1}
                value={record.trial}
                onChange={value => updateContentItem(index, "trial", value)}
            />,
        },
        {
            title: "ESA",
            dataIndex: "esa",
            render: (_, record, index) => <InputNumber
                step={0.1}
                value={record.esa}
                onChange={value => updateContentItem(index, "esa", value)}
            />,
        },
        {
            title: "FVC",
            dataIndex: "fvc",
            render: (_, record, index) => <InputNumber
                step={0.1}
                value={record.fvc}
                onChange={value => updateContentItem(index, "fvc", value)}
            />,
        },
        {
            title: "Пресетная рефракция",
            dataIndex: "preset_refraction",
            render: (_, record, index) => <InputNumber
                step={0.1}
                value={record.preset_refraction}
                onChange={value => updateContentItem(index, "preset_refraction", value)}
            />,
        },
        {
            title: "Диаметр",
            dataIndex: "diameter",
            render: (_, record, index) => <InputNumber
                step={0.1}
                value={record.diameter}
                onChange={value => updateContentItem(index, "diameter", value)}
            />,
        },
        {
            title: "Периферийная торичность",
            dataIndex: "periphery_toricity",
            render: (_, record, index) => <InputNumber
                step={0.1}
                value={record.periphery_toricity}
                onChange={value => updateContentItem(index, "periphery_toricity", value)}
            />,
        },
        {
            title: "Сторона",
            dataIndex: "side",
            render: (_, record, index) => <Select
                value={record.side}
                onChange={value => updateContentItem(index, "side", value)}
            >
                <Option value="левая">Левая</Option>
                <Option value="правая">Правая</Option>
            </Select>,
        },
        {
            title: "Количество",
            dataIndex: "count",
            render: (_, record, index) => <InputNumber
                min={1}
                value={record.count}
                onChange={value => updateContentItem(index, "count", value)}
            />,
        },
        {
            title: "Тип",
            dataIndex: "type_id",
            render: (_, record, index) => (
                <Select
                    value={record.type_id}
                    onChange={value => updateContentItem(index, "type_id", value)}
                    style={{width: "100%"}}
                    defaultValue={lensTypes[0]?.id || null}
                >
                    {lensTypes.map(lensType =>
                        <Option key={lensType.id} value={lensType.id}>{lensType.title}</Option>
                    )}
                </Select>
            ),
            width: 200,
            minWidth: 100
        },
        {
            title: "Действие",
            dataIndex: "actions",
            render: (_, __, index) => (
                <Button danger icon={<DeleteOutlined/>} onClick={() => removeContentItem(index)}/>
            ),
            minWidth: 200,
        }
    ];

    return (
        <Modal
            title={setData ? "Редактировать набор" : "Создать набор"}
            open={visible}
            onCancel={() => {
                form.resetFields();
                setContent([]);
                onCancel();
            }}
            onOk={handleSubmit}
            okText="Сохранить"
            cancelText={"Отмена"}
            width="90vw"
            style={{maxWidth: 2500}}
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Название набора" name="title" rules={[{required: true, message: "Введите название"}]}>
                    <Input/>
                </Form.Item>
            </Form>

            <div style={{maxWidth: "100%", overflowX: "auto"}}>
                <Table
                    dataSource={content}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    scroll={{x: "max-content", y: 300}}
                    locale={{emptyText: "Добавьте элементы"}}
                />
            </div>

            <Space style={{marginTop: 10}}>
                <Button icon={<PlusOutlined/>} onClick={addContentItem}>Добавить элемент</Button>
            </Space>
        </Modal>
    );
};

SetFormModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    setData: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
    }),
}


export default SetFormModal;
