import {useState, useEffect} from "react";
import {
    Input,
    Select,
    List,
    FloatButton,
    Row,
    Col,
    Spin,
    Button,
    Form,
    InputNumber,
    Card, Grid, notification, Tabs
} from "antd";
import LensesPage from "../pages/LensesPage.jsx";
import {FolderViewOutlined, SwitcherOutlined} from "@ant-design/icons";

const {Option} = Select;

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
        children: '1233',
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