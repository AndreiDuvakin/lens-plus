import PropTypes from "prop-types";
import {Card, Modal, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

const SetListCard = ({set, handleEditSet, handleDeleteSet, handleAppendSet}) => {

    const confirmSetDelete = () => {
        Modal.confirm({
            title: "Удаление набора",
            content: `Вы уверены, что хотите удалить набор ${set.title}?`,
            okText: "Да, удалить",
            cancelText: "Отмена",
            onOk: () => handleDeleteSet(set.id),
        });
    };

    const confirmAppendSet = () => {
        Modal.confirm({
            title: "Добавление набора",
            content: `Вы уверены, что хотите добавить набор ${set.title} в общий список линз?`,
            okText: "Да, добавить",
            cancelText: "Отмена",
            onOk: () => handleAppendSet(set),
        });
    };

    const actions = [
        <Tooltip title="Добавление набора в общий список линз" key={"add"}>
            <PlusOutlined
                onClick={confirmAppendSet}
            />
        </Tooltip>,

        <Tooltip title="Редактирование набора" key={"edit"}>
            <EditOutlined
                onClick={() => {
                    handleEditSet(set);
                }}
            />
        </Tooltip>,

        <Tooltip title="Удаление набора" key={"delete"}>
            <DeleteOutlined
                style={{color: "red"}}
                onClick={confirmSetDelete}
            />
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