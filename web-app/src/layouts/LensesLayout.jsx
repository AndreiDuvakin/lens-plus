import {
    Tabs
} from "antd";
import LensesPage from "../pages/LensesPage.jsx";
import {FolderViewOutlined, SwitcherOutlined} from "@ant-design/icons";
import SetLensesPage from "../pages/SetLensesPage.jsx";


const items = [
    {
        key: '1',
        label: 'Линзы',
        children: <LensesPage/>,
        icon: <FolderViewOutlined/>
    },
    {
        key: '2',
        label: 'Наборы линз',
        children: <SetLensesPage/>,
        icon: <SwitcherOutlined/>
    }
]

const LensesLayout = () => {
    return (
        <Tabs
            defaultActiveKey="1"
            items={items}
        />
    );
};

export default LensesLayout;