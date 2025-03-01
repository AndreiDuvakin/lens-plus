import PropTypes from "prop-types";
import {Card, Modal, Popconfirm, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

const SetListCard = ({set, handleEditSet, handleDeleteSet, handleAppendSet}) => {


    const deleteSet = () => {
        handleDeleteSet(set.id);
    };


    const appendSet = () => {
        handleAppendSet(set);
    };

    const actions = [
        <Tooltip title="Добавление набора в общий список линз" key={"add"}>
            <Popconfirm
                title="Добавление набора в общий список линз"
                description="Вы уверены, что хотите добавить набор в общий список линз?"
                onConfirm={appendSet}
                okText="Да, добавить"
                cancelText="Отмена"
            >
                <PlusOutlined/>
            </Popconfirm>
        </Tooltip>,

        <Tooltip title="Редактирование набора" key={"edit"}>
            <EditOutlined
                onClick={() => {
                    handleEditSet(set);
                }}
            />
        </Tooltip>,

        <Tooltip title="Удаление набора" key={"delete"}>
            <Popconfirm
                title="Удаление набора"
                description="Вы уверены, что хотите удалить набор?"
                onConfirm={deleteSet}
                okText="Да, удалить"
                cancelText="Отмена"
            >
                <DeleteOutlined
                    style={{color: "red"}}
                />
            </Popconfirm>
        </Tooltip>,
    ];

    return (
        <>
            <Card
                type="inner"
                title={set.title}
                actions={actions}
            />
        </>
    );
};

SetListCard.propTypes = {
    set: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
    }).isRequired,
    handleEditSet: PropTypes.func.isRequired,
    handleAppendSet: PropTypes.func.isRequired,
    handleDeleteSet: PropTypes.func.isRequired,
};


export default SetListCard;