import {Form, Input, Button, Row, Col, Typography} from 'antd';
import {useEffect, useState} from 'react';
import {useAuth} from "../AuthContext.jsx";
import {useNavigate} from "react-router-dom";

const {Title} = Typography;

const LoginPage = () => {
    const {user, login} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate("/");
        }
        document.title = "Авторизация";
    }, [user, navigate]);

    const onFinish = async (values) => {
        setLoading(true);
        setError(null);

        try {
            await login(values);
            navigate("/");
        } catch (error) {
            setError(`Ошибка при входе: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" align="middle" style={{minHeight: '100vh'}}>
            <Col xs={24} sm={18} md={12} lg={8} xl={6}>
                <div style={{padding: 20, border: '1px solid #ddd', borderRadius: 8}}>
                    <Title level={2} style={{textAlign: 'center'}}>Авторизация</Title>

                    {error && <div style={{color: 'red', marginBottom: 15}}>{error}</div>}

                    <Form
                        name="login"
                        initialValues={{remember: true}}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="login"
                            rules={[{required: true, message: 'Пожалуйста, введите логин'}]}
                        >
                            <Input placeholder="Логин"/>
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{required: true, message: 'Пожалуйста, введите пароль'}]}
                        >
                            <Input.Password placeholder="Пароль"/>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                            >
                                Войти
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Col>
        </Row>
    );
};

export default LoginPage;
