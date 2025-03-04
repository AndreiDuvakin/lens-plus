import {Collapse, Modal} from "antd";
import PropTypes from "prop-types";


const LensIssueViewModal = ({visible, onCancel, lensIssue}) => {
    let items = [];

    if (lensIssue) {
        items = [
            {
                key: '1',
                label: 'Подробная информация о линзе',
                children:
                    <div>
                        <p><b>id:</b> {lensIssue.lens.id}</p>
                        <p><b>Линза:</b> {lensIssue.lens.side}</p>
                        <p><b>Диаметр:</b> {lensIssue.lens.diameter}</p>
                        <p><b>Тор:</b> {lensIssue.lens.tor}</p>
                        <p><b>Пресетная рефракция:</b> {lensIssue.lens.preset_refraction}</p>
                        <p><b>Периферийная торичность:</b> {lensIssue.lens.periphery_toricity}</p>
                        <p><b>FVC:</b> {lensIssue.lens.fvc}</p>
                        <p><b>ESP:</b> {lensIssue.lens.esa}</p>
                    </div>,
            },
            {
                key: '2',
                label: 'Подробная информация о пациенте',
                children:
                    <div>
                        <p><b>Пациент:</b> {lensIssue.patient.last_name} {lensIssue.patient.first_name}</p>
                        <p><b>Дата рождения:</b> {new Date(lensIssue.patient.birthday).toLocaleDateString("ru-RU")}</p>
                        <p><b>Адрес:</b> {lensIssue.patient.address}</p>
                        <p><b>Email:</b> {lensIssue.patient.email}</p>
                        <p><b>Телефон:</b> {lensIssue.patient.phone}</p>
                        <p><b>Диагноз:</b> {lensIssue.patient.diagnosis}</p>
                        <p><b>Коррекция:</b> {lensIssue.patient.correction}</p>
                    </div>,
            },
            {
                key: '3',
                label: 'Подробная информация о выдавшем сотруднике',
                children:
                    <div>
                        <p><b>Сотрудник:</b> {lensIssue.doctor.last_name} {lensIssue.doctor.first_name}</p>
                        <p><b>Логин:</b> {lensIssue.doctor.login}</p>
                    </div>,
            }
        ]
    }

    return (
        <Modal
            open={visible}
            title="Детали выдачи линзы"
            onCancel={onCancel}
            footer={null}
        >
            {lensIssue && (
                <div>
                    <p><b>Дата выдачи:</b> {new Date(lensIssue.issue_date).toLocaleDateString("ru-RU")}</p>
                    <p><b>Пациент:</b> {lensIssue.patient.last_name} {lensIssue.patient.first_name}</p>
                    <p><b>Выдал:</b> {lensIssue.doctor.last_name} {lensIssue.doctor.first_name}</p>

                    <Collapse items={items}/>
                </div>
            )}
        </Modal>
    )
};

LensIssueViewModal.propTypes = {
    visible: PropTypes.bool,
    onCancel: PropTypes.func,
    lensIssue: PropTypes.shape({
        issue_date: PropTypes.string,
        patient: PropTypes.shape({
            first_name: PropTypes.string,
            last_name: PropTypes.string,
            patronymic: PropTypes.string,
            birthday: PropTypes.string,
            address: PropTypes.string,
            email: PropTypes.string,
            phone: PropTypes.string,
            diagnosis: PropTypes.string,
            correction: PropTypes.string,
        }),
        doctor: PropTypes.shape({
            last_name: PropTypes.string,
            first_name: PropTypes.string,
            login: PropTypes.string,
        }),
        lens: PropTypes.shape({
            id: PropTypes.number.isRequired,
            tor: PropTypes.number.isRequired,
            diameter: PropTypes.number.isRequired,
            esa: PropTypes.number.isRequired,
            fvc: PropTypes.number.isRequired,
            preset_refraction: PropTypes.number.isRequired,
            periphery_toricity: PropTypes.number.isRequired,
            side: PropTypes.string.isRequired,
            issued: PropTypes.bool.isRequired,
            trial: PropTypes.number.isRequired,
        }),
    }),
};

export default LensIssueViewModal;