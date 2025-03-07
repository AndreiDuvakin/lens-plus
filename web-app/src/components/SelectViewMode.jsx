import {BuildOutlined, TableOutlined} from "@ant-design/icons";
import {Select, Tooltip} from "antd";
import PropTypes from "prop-types";

const {Option} = Select;

const SelectViewMode = ({viewMode, setViewMode, localStorageKey, toolTipText}) => {
    return (
        <Tooltip
            title={toolTipText}
        >
            <Select
                value={viewMode}
                onChange={value => {
                    setViewMode(value);
                    localStorage.setItem(localStorageKey, value);
                }}
                style={{width: "100%"}}
            >
                <Option value={"tile"}>
                    <BuildOutlined style={{marginRight: 8}} />
                    Плитка
                </Option>
                <Option value={"table"}>
                    <TableOutlined style={{marginRight: 8}}/>
                    Таблица
                </Option>
            </Select>
        </Tooltip>

    )
};

SelectViewMode.propTypes = {
    viewMode: PropTypes.string.isRequired,
    setViewMode: PropTypes.func.isRequired,
    localStorageKey: PropTypes.string.isRequired,
};

export default SelectViewMode;