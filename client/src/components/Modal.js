import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleModal } from '../redux/actions/misc';



const Modal = ({modalVisible, toggleModal, modalData}) => {

    if(!modalVisible) return null;

    return (
        <div className="modal-container">
            <div className="modal-message">

                {modalData.status}
                {modalData.message}

                <button onClick={toggleModal}>CLOSE</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    // console.log(state, 'state in modal')
    return {
        modalVisible: state.misc.modalVisible,
        modalData: state.misc.modalData
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
    modalData: PropTypes.object.isRequired,
    modalVisible: PropTypes.bool.isRequired,
    toggleModal: PropTypes.func.isRequired
}

//need to allow for passing functions on confirm