import {useState} from "react";
import {Layout, Menu} from "antd";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {
    AppstoreOutlined,
    CalendarOutlined,
    DatabaseOutlined,
    UserOutlined,
    SolutionOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import {useAuth} from "../AuthContext.jsx";

const {Content, Footer, Sider} = Layout;

const getItem = (label, key, icon, children) => ({key, icon, children, label});

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const {logout} = useAuth();

    const menuItems = [
        getItem("Главная", "/", <AppstoreOutlined/>),
        getItem("Приёмы", "/appointments", <CalendarOutlined/>),
        getItem("Линзы", "/lenses", <DatabaseOutlined/>),
        getItem("Пациенты", "/patients", <SolutionOutlined/>),
        getItem("Выдачи линз", "/dispensing", <DatabaseOutlined/>),
        {type: "divider"},
        getItem("Мой профиль", "profile", <UserOutlined/>, [
            getItem("Перейти в профиль", "/profile", <UserOutlined/>),
            getItem("Выйти", "logout", <LogoutOutlined/>)
        ])
    ];

    const handleMenuClick = ({key}) => {
        if (key === "logout") {
            logout();
            return;
        }
        navigate(key);
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div style={{display: "flex", justifyContent: "center", padding: 16}}>
                    <img
                        src="/logo_rounded.png"
                        alt="Логотип"
                        style={{width: collapsed ? 40 : 80, transition: "width 0.2s"}}
                    />
                </div>
                <Menu
                    theme="dark"
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={menuItems}
                    onClick={handleMenuClick}
                />
            </Sider>

            <Layout>
                <Content style={{margin: "0 16px"}}>
                    <div style={{marginTop: 15, padding: 24, minHeight: 360, background: "#fff", borderRadius: 8}}>
                        <Outlet/>
                    </div>
                </Content>

                <Footer style={{textAlign: "center"}}>Линза+ © {new Date().getFullYear()}</Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
