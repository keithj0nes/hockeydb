import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Select, Checkbox } from 'antd';
import { toggleModal } from '../redux/actions/misc';
import { Button } from '.';
import './checkbox.scss';

class DeleteModal extends React.Component {
    state = {
        shouldBeDeleted: false,
        hideInput: false,
    }

    componentDidMount() {
        console.log(this.props, 'to be deleted')
        if (this.props.data.toBeDeleted === null) {
            this.setState({ shouldBeDeleted: true, hideInput: true })
        }
    }

    handleChangeDelete = (e, name) => {
        this.props.data.toBeDeletedString ? this.setState({ shouldBeDeleted: e.target.value === this.props.data.toBeDeletedString }) : this.setState({ shouldBeDeleted: e.target.value === this.props.data.toBeDeleted.name });
    }

    render() {
        const { data, isLoading, toggleModal } = this.props;
        return (
            <div>
                <p>{data.message}</p>
                <br />

                {isLoading && 'Loading...'}

                {!this.state.hideInput && (
                    <div className="modal-field">
                        <label htmlFor="del">{!!data.toBeDeletedString ? data.toBeDeletedString : data.toBeDeleted?.name}</label>
                        <input type="text" name="del" id="del" onChange={this.handleChangeDelete} />
                    </div>
                )}

                {data.errors && (
                    <p className="modal-error">{data.errors}</p>
                )}

                <div className="modal-button-container">
                    <Button title="Cancel" type="cancel" onClick={toggleModal} />
                    <Button title="Delete" type={!this.state.shouldBeDeleted ? 'disabled' : 'danger'} htmlType="submit" onClick={data.deleteAction} />
                </div>
            </div>
        );
    }
}

const AlertModal = ({ data, toggleModal }) => (
    <div>
        {data.message.split('\n').map((text, ind) => <p key={ind}>{text}</p>)}
        <br /> <br />

        <div className="modal-button-container">
            <Button type="admin" title="Close" onClick={() => (data.confirmAction ? (data.confirmAction(), toggleModal()) : toggleModal())} />
        </div>
    </div>
);


const PromptModal = ({ data, toggleModal }) => (
    <Form
        layout="vertical"
        className="haha"
        // use object.assign to merge array of objects into one object
        initialValues={Object.assign({}, ...data.fields.map(item => ({ [item.name]: item.defaultValue })))}
        onFinish={data.confirmAction}
    >
        {data.message && <p>{data.message}</p>}
        <br />

        {data.fields.map(field => (
            <div key={field.name}>
                {console.log(field, 'field')}

                {field.type === 'input' && (
                    <Form.Item label={field.title} name={field.name} rules={field.rules}>
                        <Input placeholder={field.title} disabled={field.disabled} />
                    </Form.Item>
                )}

                {field.type === 'select' && (
                    <Form.Item label={field.title} name={field.name} rules={field.rules}>
                        <Select placeholder={field.title}>
                            {field.listOfSelects.map(item => <Select.Option key={item.name} value={item.value}>{item.value}</Select.Option>)}
                        </Select>
                    </Form.Item>
                )}

                {field.type === 'checkbox' && (
                    <Form.Item name={field.name} valuePropName="checked">
                        <Checkbox>{field.title}</Checkbox>
                    </Form.Item>
                )}

                { !!field.customComponent && (
                    <div className="modal-field">
                        <label htmlFor="">{field.title}</label>
                        {field.customComponent}
                    </div>
                ) }
            </div>
        ))}

        {data.errors && (
            <p className="modal-error">{data.errors}</p>
        )}

        <div className="modal-button-container">
            <Button title="Cancel" type="cancel" onClick={toggleModal} />
            <Button htmlType="submit" title={data.confirmActionTitle} type="admin" />
        </div>
    </Form>
);


const renderModalType = (modalType, modalProps, isLoading, toggleModal) => {
    switch (modalType) {
    case 'delete':
        return <DeleteModal data={modalProps} isLoading={isLoading} toggleModal={toggleModal} />;
    case 'alert':
        return <AlertModal data={modalProps} isLoading={isLoading} toggleModal={toggleModal} />;
    case 'prompt':
        return <PromptModal data={modalProps} isLoading={isLoading} toggleModal={toggleModal} />;
    default:
        return null;
    }
};

const Modal = ({ modalVisible, toggleModal, modalProps, modalType, isLoading }) => {
    const body = document.getElementsByTagName('body')[0].style;
    body.overflow = 'auto';
    body.position = 'auto';

    if (!modalVisible) return null;

    const handleClose = e => e.currentTarget === e.target && toggleModal();

    body.overflow = 'hidden';
    body.position = 'relative';

    return (
        <div className="modal-container" onClick={modalProps.isClosableOnBackgroundClick ? handleClose : null}>
            <div className="modal-message">

                <div className="modal-close" onClick={toggleModal}>&times;</div>

                <div className="modal-title">
                    <h2>{modalProps.title}</h2>
                </div>

                <div className="modal-content">
                    {renderModalType(modalType, modalProps, isLoading, toggleModal)}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    modalVisible: state.misc.modalVisible,
    modalProps: state.misc.modalProps,
    modalType: state.misc.modalType,
    isLoading: state.misc.isLoading,
});


const mapDispatchToProps = dispatch => ({
    toggleModal: () => dispatch(toggleModal()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Modal);

Modal.propTypes = {
    modalProps: PropTypes.object.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired,
    modalType: PropTypes.string,
    isLoading: PropTypes.bool,
};

PromptModal.propTypes = {
    data: PropTypes.object,
    toggleModal: PropTypes.func.isRequired,
};

AlertModal.propTypes = {
    data: PropTypes.object,
    toggleModal: PropTypes.func.isRequired,
};

DeleteModal.propTypes = {
    data: PropTypes.object,
    toggleModal: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};


// modalProps = {
//     isVisible: PropTypes.bool.isRequired,
//     isClosableOnBackgroundClick: PropTypes.bool.isRequired
//     title: PropTypes.string.isRequired,

//     toBeDeleted: PropTypes.object,
//     message: PropTypes.string,
//     fields: PropTypes.object,
//     onChange: PropTypes.func,
//     deleteAction: PropTypes.func,
//     confirmAction: PropTypes.func
// }


// fields = {
//     title: PropTypes.string.isRequired,
//     type: PropTypes.string.isRequired, //'select', 'input', 'checkbox'
//     name: PropTypes.string.isRequired,
//     defaultValue: PropTypes.string.isRequired,
//     listOfSelects: PropTypes.array,
//     hiddenValue: PropTypes.string
//     customComponent: PropTypes.func
// }


// EXAMPLE

// this.props.toggleModal({
//     isVisible: true,
//     toBeDeleted: item,
//     title: 'Edit Season',
//     message: 'Are you sure you want to delete this season?',
//     fields: [
//         {
//             type: 'input',
//             name: 'name',
//             defaultValue: item.name
//         },
//         {
//             type: 'select',
//             name: 'type',
//             defaultValue: item.type,
//             listOfSelects: this.state.seasonTypes,
//             hiddenValue: 'Please select a type'
//         },
//         {
//             type: 'checkbox',
//             name: 'is_active',
//             defaultValue: item.is_active
//         }
//     ],
//     onChange: this.handleChange,
//     confirmAction: () => console.log(this.state, 'this.state'),
//     deleteAction: () => this.props.deleteSeason(item.id),
// }, 'prompt');
// need to allow for passing functions on confirm
