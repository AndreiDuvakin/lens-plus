import {Card, Modal, Tooltip} from "antd";
import PropTypes from "prop-types";
import {DeleteOutlined, EditOutlined, EyeOutlined} from "@ant-design/icons";
import {useState} from "react";
import LensViewModal from "./LensViewModal.jsx";

const LensListCard = ({lens, handleEditLens, handleDeleteLens}) => {
    const [showModalInfo, setShowModalInfo] = useState(false);

    const deleteLensConfirm = () => {
        Modal.confirm({
            title: "Удаление линзы",
            content: `Вы уверены, что хотите удалить линзу с параметрами ${lens.side} ${lens.diameter}мм?`,
            okText: "Да, удалить",
            cancelText: "Отмена",
            onOk: () => handleDeleteLens(lens.id),
        });
    };

    const handleViewLens = () => {
        setShowModalInfo(true);
    };

    const actions = [
        <Tooltip title="Просмотр линзы" key={"viewLens"}>
            <EyeOutlined onClick={handleViewLens}/>
        </Tooltip>,
        <Tooltip title="Редактирование линзы" key={"editLens"}>
            <EditOutlined onClick={() => handleEditLens(lens)}/>
        </Tooltip>,
        <Tooltip title="Удаление линзы" key={"deleteLens"}>
            <DeleteOutlined
                onClick={deleteLensConfirm}
                style={{color: "red"}}
            />
        </Tooltip>,
    ];

    return (
        <>
            <Card
                type="inner"
                title={`Линза ${lens.side} ${lens.diameter} мм`}
                actions={actions}
            >
                <p><strong>🔬 Тор:</strong> {lens.tor} D</p>
                <p><strong>📏 Диаметр:</strong> {lens.diameter} мм</p>
                <p><strong>🔄 Пресетная рефракция:</strong> {lens.preset_refraction} D</p>
                <p><strong>⚙️ Периферийная торичность:</strong> {lens.periphery_toricity} D</p>
                {lens.issued && <p><strong>✅ Линза выдана</strong></p>}
            </Card>

            <LensViewModal
                visible={showModalInfo}
                onCancel={() => setShowModalInfo(false)}
                lens={lens}
            />
        </>
    );
};

LensListCard.propTypes = {
    lens: PropTypes.shape({
        id: PropTypes.number.isRequired,
        tor: PropTypes.number.isRequired,
        trial: PropTypes.number,
        esa: PropTypes.number,
        fvc: PropTypes.number,
        preset_refraction: PropTypes.number.isRequired,
        diameter: PropTypes.number.isRequired,
        periphery_toricity: PropTypes.number.isRequired,
        side: PropTypes.string.isRequired,
        issued: PropTypes.bool.isRequired,
    }).isRequired,
    handleEditLens: PropTypes.func.isRequired,
    handleDeleteLens: PropTypes.func.isRequired,
};

export default LensListCard;
