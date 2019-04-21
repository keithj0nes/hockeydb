import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleModal } from '../redux/actions/misc';


const DeleteModal = ({data, isLoading}) => (
    <div>
        <p>{data.message}</p>
        <br/> <br/>
        <p>{data.toBeDeleted.name}</p>
        <br/> <br/>

        {isLoading && 'Loading...'}

        <br/> <br/>

        <button onClick={data.deleteAction}>Delete</button>
    </div>
)

const AlertModal = ({data, toggleModal}) => (
    <div>
        {data.message.split('\n').map((text, ind) => <p key={ind}>{text}</p>)}
        <br/> <br/>

        <button onClick={toggleModal}>OK</button>
    </div>
)


const renderModalType = (modalType, modalProps, isLoading) => {
    switch (modalType) {
        case 'delete':
            return <DeleteModal data={modalProps} isLoading={isLoading}/>
        case 'alert':
            return <AlertModal data={modalProps} isLoading={isLoading}/>
    
        default:
            break;
    }
}


const Modal = ({modalVisible, toggleModal, modalProps, modalType, isLoading}) => {

    if(!modalVisible) return null;

    console.log(modalProps, 'modalProps')

    return (
        <div className="modal-container">
            <div className="modal-message">

                <h2>{modalProps.title}</h2>

                {renderModalType(modalType, modalProps, isLoading)}
                
                <button onClick={toggleModal}>CLOSE</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    console.log(state, 'state in modal')
    return {
        modalVisible: state.misc.modalVisible,
        modalProps: state.misc.modalProps,
        modalType: state.misc.modalType,
        isLoading: state.misc.isLoading,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleModal: () => dispatch(toggleModal())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Modal);

Modal.propTypes = {
    // title: PropTypes.string.isRequired,
    modalProps: PropTypes.object.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired
}

//need to allow for passing functions on confirm