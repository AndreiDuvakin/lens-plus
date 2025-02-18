import {useEffect} from "react";
import {Modal, Form, Input, DatePicker} from "antd";
import PropTypes from "prop-types";
import locale from "antd/es/date-picker/locale/ru_RU";
import validator from "validator";
import {MaskedInput} from "antd-mask-input";
import dayjs from "dayjs";

const {TextArea} = Input;

const PatientFormModal = ({visible, onCancel, onSubmit, patient}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            form.resetFields();
            if (patient) {
                form.setFieldsValue({
                    ...patient,
                    birthday: patient.birthday ? dayjs(patient.birthday, "YYYY-MM-DD") : null,
                });
            }
        }
    }, [visible, patient]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (values.birthday) {
                values.birthday = values.birthday.format("YYYY-MM-DD");
            }
            onSubmit(values);
            form.resetFields();
        } catch (errorInfo) {
            console.log("Validation Failed:", errorInfo);
        }
    };

    return (
        <Modal
            title={patient ? "Редактировать пациента" : "Добавить пациента"}
            open={visible}
            onCancel={() => {
                form.resetFields();
                onCancel();
            }}
            onOk={handleOk}
            okText="Сохранить"
            cancelText="Отмена"
            centered
            maskClosable={false}
            forceRender={true}
            style={{top: 20}}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="first_name"
                    label="Имя"
                    rules={[{required: true, message: "Введите имя"}]}
                >
                    <Input placeholder="Введите имя"/>
                </Form.Item>
                <Form.Item
                    name="last_name"
                    label="Фамилия"
                    rules={[{required: true, message: "Введите фамилию"}]}
                >
                    <Input placeholder="Введите фамилию"/>
                </Form.Item>
                <Form.Item
                    name="patronymic"
                    label="Отчество"
                >
                    <Input placeholder="Введите отчество (необязательно)"/>
                </Form.Item>
                <Form.Item
                    name="birthday"
                    label="Дата рождения"
                    rules={[{required: true, message: "Выберите дату рождения"}]}
                >
                    <DatePicker style={{width: "100%"}} locale={locale} format="DD.MM.YYYY"/>
                </Form.Item>
                <Form.Item
                    name="address"
                    label="Адрес"
                >
                    <Input placeholder="Введите адрес"/>
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (value && !validator.isEmail(value)) {
                                    return Promise.reject("Некорректный email");
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Input placeholder="Введите email"/>
                </Form.Item>
                <Form.Item
                    name="phone"
                    label="Телефон"
                    rules={[
                        {required: true, message: "Введите телефон"},
                    ]}
                >
                    <MaskedInput placeholder="Введите номер телефона" mask="+7 (000) 000-00-00"/>
                </Form.Item>
                <Form.Item
                    name="diagnosis"
                    label="Диагноз"
                >
                    <TextArea rows={3} placeholder="Введите диагноз"/>
                </Form.Item>
                <Form.Item
                    name="correction"
                    label="Коррекция"
                >
                    <TextArea rows={3} placeholder="Введите информацию о коррекции"/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

PatientFormModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    patient: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        patronymic: PropTypes.string,
        birthday: PropTypes.string,
        address: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        diagnosis: PropTypes.string,
        correction: PropTypes.string,
    }),
};

export default PatientFormModal;
