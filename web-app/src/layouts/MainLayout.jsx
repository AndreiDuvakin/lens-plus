import {useState} from "react";
import {Layout, Menu} from "antd";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from "@ant-design/icons";

const {Content, Footer, Sider} = Layout;

const getItem = (label, key, icon, children) => ({
    key,
    icon,
    children,
    label,
});

const items = [
    getItem("Главная", "/", <PieChartOutlined/>),
    getItem("Настройки", "/settings", <DesktopOutlined/>),
    getItem("Пользователи", "sub1", <UserOutlined/>, [
        getItem("Том", "/users/tom"),
        getItem("Билл", "/users/bill"),
        getItem("Алекс", "/users/alex"),
    ]),
    getItem("Команда", "sub2", <TeamOutlined/>, [
        getItem("Команда 1", "/team/1"),
        getItem("Команда 2", "/team/2"),
    ]),
    getItem("Файлы", "/files", <FileOutlined/>),
];

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={[location.pathname]}
                    mode="inline"
                    items={items}
                    onClick={({key}) => navigate(key)}
                />
            </Sider>

            <Layout>
                <Content style={{margin: "0 16px"}}>
                    <div style={{padding: 24, minHeight: 360, background: "#fff", borderRadius: 8}}>
                        <Outlet/>
                    </div>
                </Content>

                <Footer style={{textAlign: "center"}}>Линза+ © {new Date().getFullYear()}</Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
