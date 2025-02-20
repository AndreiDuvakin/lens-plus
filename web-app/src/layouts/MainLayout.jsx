import {useState} from "react";
import {Layout, Menu} from "antd";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {
    HomeOutlined,
    CalendarOutlined,
    DatabaseOutlined,
    FolderViewOutlined,
    UserOutlined,
    TeamOutlined,
    LogoutOutlined,
    MessageOutlined
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
        getItem("Главная", "/", <HomeOutlined/>),
        getItem("Приёмы", "/appointments", <CalendarOutlined/>),
        getItem("Выдачи линз", "/dispensing", <DatabaseOutlined/>),
        getItem("Линзы и наборы", "/lenses", <FolderViewOutlined/>),
        getItem("Пациенты", "/patients", <TeamOutlined/>),
        getItem("Рассылки", "/mailing", <MessageOutlined/>),
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
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} style={{height: "100vh", position: "fixed", left: 0}}>
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

            <Layout style={{marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s"}}>
                <Content style={{margin: "0 16px", padding: 24, minHeight: "100vh", overflow: "auto", background: "#fff", borderRadius: 8, marginTop: "15px"}}>
                    <Outlet/>
                </Content>
                <Footer style={{textAlign: "center"}}>Линза+ © {new Date().getFullYear()}</Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
