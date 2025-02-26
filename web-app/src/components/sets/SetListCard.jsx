import PropTypes from "prop-types";
import {Card, Modal, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";

const SetListCard = ({set, handleEditSet, handleAddSet, handleDeleteSet}) => {

    const confirmSetDelete = () => {
        Modal.confirm({
            title: "Удаление набора",
            content: `Вы уверены, что хотите удалить набор ${set.title}?`,
            okText: "Да, удалить",
            cancelText: "Отмена",
            onOk: () => handleDeleteSet(set.id),
        });
    };

    const actions = [
        <Tooltip title="Добавить набор" key={"add"}>
            <PlusOutlined
                onClick={handleAddSet}
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
    handleAddSet: PropTypes.func.isRequired,
    handleDeleteSet: PropTypes.func.isRequired,
};


export default SetListCard;