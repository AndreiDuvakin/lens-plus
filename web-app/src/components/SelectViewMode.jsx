import {BuildOutlined, TableOutlined} from "@ant-design/icons";
import {Select, Tooltip} from "antd";
import PropTypes from "prop-types";

const {Option} = Select;

const SelectViewMode = ({viewMode, setViewMode, localStorageKey, toolTipText, viewModes}) => {
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
                {viewModes.map(viewMode => (
                    <Option key={viewMode.value} value={viewMode.value}>
                        {viewMode.icon}
                        {viewMode.label}
                    </Option>
                ))}
            </Select>
        </Tooltip>

    )
};

SelectViewMode.propTypes = {
    viewMode: PropTypes.string.isRequired,
    setViewMode: PropTypes.func.isRequired,
    localStorageKey: PropTypes.string.isRequired,
    toolTipText: PropTypes.string.isRequired,
    viewModes: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.element,
    })).isRequired,
};

export default SelectViewMode;