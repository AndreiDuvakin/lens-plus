import {Form, InputNumber, Modal, notification, Select} from "antd";
import {useEffect, useState} from "react";
import PropTypes from "prop-types";
import getAllLensTypes from "../../api/lens_types/GetAllLensTypes.jsx";
import {useAuth} from "../../AuthContext.jsx";


const LensFormModal = ({visible, onCancel, onSubmit, lens}) => {
    const {user} = useAuth();

    const [form] = Form.useForm();

    const [lensTypes, setLensTypes] = useState([]);

    useEffect(() => {
        fetchLensTypes();
    }, [])

    useEffect(() => {
        if (visible) {
            form.resetFields();
            if (lens) {
                form.setFieldsValue({
                    ...lens,
                })
            }
        }
    }, [visible, lens]);

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
    }

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
            form.resetFields();
        } catch (error) {
            console.log("Validation Failed:", error)
        }
    };

    return (
        <Modal
            title={lens ? "Редактировать лину" : "Добавить линзу"}
            open={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
            okText={"Сохранить"}
            cancelText={"Отмена"}
            maskClosable={false}
            forceRender={true}
            style={{top: 20}}
            centered
        >
            <Form form={form} layout={"vertical"}>
                <Form.Item
                    name="tor"
                    label="Тор"
                    rules={[{required: true, message: "Введите тор"}]}
                >
                    <InputNumber
                        step={0.1}
                    />
                </Form.Item>

                <Form.Item
                    name="trial"
                    label="Острота зрения (Trial)"
                    rules={[{required: true, message: "Введите остроту зрения"}]}
                >
                    <InputNumber
                        step={0.1}
                    />
                </Form.Item>

                <Form.Item
                    name="esa"
                    label="Esa"
                    rules={[{required: true, message: "Введите esa"}]}
                >
                    <InputNumber/>
                </Form.Item>

                <Form.Item
                    name="fvc"
                    label="FVC"
                    rules={[{required: true, message: "Введите fvc"}]}
                >
                    <InputNumber/>
                </Form.Item>

                <Form.Item
                    name="preset_refraction"
                    label="Пресетная рефракция"
                    rules={[{required: true, message: "Введите пресетную рефракцию"}]}
                >
                    <InputNumber/>
                </Form.Item>

                <Form.Item
                    name="diameter"
                    label="Диаметр"
                    rules={[{required: true, message: "Введите диаметр"}]}
                >
                    <InputNumber/>
                </Form.Item>

                <Form.Item
                    name="periphery_toricity"
                    label="Периферия торичность"
                    rules={[{required: true, message: "Введите периферию торичность"}]}
                >
                    <InputNumber/>
                </Form.Item>

                <Form.Item
                    name="side"
                    label="Сторона"
                    rules={[{required: true, message: "Выберите сторону"}]}
                >
                    <Select>
                        <Select.Option value="left">Левая</Select.Option>
                        <Select.Option value="right">Правая</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="type_id"
                    label="Тип линзы"
                    rules={[{required: true, message: "Выберите тип линзы"}]}
                >
                    <Select>
                        {lensTypes.map((type) => (
                            <Select.Option key={type.id} value={type.id}>
                                {type.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    )
};

LensFormModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    lens: PropTypes.shape({
        tor: PropTypes.number.isRequired,
        trial: PropTypes.number.isRequired,
        esa: PropTypes.number.isRequired,
        fvc: PropTypes.number.isRequired,
        preset_refraction: PropTypes.number.isRequired,
        diameter: PropTypes.number.isRequired,
        periphery_toricity: PropTypes.number.isRequired,
        side: PropTypes.string.isRequired,
        issued: PropTypes.bool.isRequired,
        type_id: PropTypes.number.isRequired,
    }),
}

export default LensFormModal;