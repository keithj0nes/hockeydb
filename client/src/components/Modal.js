import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleModal } from '../redux/actions/misc';
import { Button } from '../components';

class DeleteModal extends React.Component {

    handleChangeDelete = (e, name) => {
        this.setState({shouldBeDeleted: e.target.value === this.props.data.toBeDeleted.name})
    }

    state = {
        shouldBeDeleted: false
    }

    render(){
        const { data, isLoading, toggleModal } = this.props;
        return (
            <div>
                <p>{data.message}</p>
                <br/>
    
                {isLoading && 'Loading...'}
    

                <div className="modal-field">
                    <label htmlFor={'del'}>{data.toBeDeleted.name}</label>
                    <input type="text" name={'del'} id={'del'} onChange={this.handleChangeDelete}/>
                </div>
    
                {/* <button onClick={data.deleteAction} disabled={!this.state.shouldBeDeleted}>Delete</button> */}

                <div className="modal-button-container">
                    <Button title={'Cancel'} cancel onClick={toggleModal} />
                    <Button title={'Delete'} danger onClick={data.deleteAction} disabled={!this.state.shouldBeDeleted} />
                </div>
            </div>
        )
    }

}
// const DeleteModal = ({data, isLoading}) => {
//     // var mv = false

//     // const handleChangeDelete = (e, name) => {
//     //     console.log(e.target.value, 'valueeee')
    
//     //     if(e.target.value === name){
//     //         console.log('IT MATCHES!')
//     //         mv = true
//     //         return 
//     //     }
//     //     return mv = false
//     // }
    

//     return (

//         <div>
//             <p>{data.message}</p>
//             <br/> <br/>
//             <p>{data.toBeDeleted.name}</p>
//             <br/> <br/>

//             {isLoading && 'Loading...'}

//             <br/>

//             {/* <input type="text" onChange={e => handleChangeDelete(e, data.toBeDeleted.name)}/>     */}

//             <br/>

//             <button onClick={data.deleteAction}>Delete</button>
//         </div>
//     )
// }

const AlertModal = ({data, toggleModal}) => (
    <div>
        {data.message.split('\n').map((text, ind) => <p key={ind}>{text}</p>)}
        <br/> <br/>

        {/* <button onClick={toggleModal}>OK</button> */}

        <div className="modal-button-container">
                {/* <Button title={'Cancel'} cancel onClick={toggleModal} /> */}
                <Button title={'Close'} onClick={toggleModal} />
            </div>
    </div>
)


const PromptModal = ({data, toggleModal}) => {
    return (
        <div>
            {data.message && <p>{data.message}</p>}
            <br/>
            {data.fields.map(field => {

                return (
                    <div key={field.name}>

                        {field.type === 'input' && (
                            <div className="modal-field">
                                <label htmlFor={field.name}>{field.title}</label>
                                <input type="text" name={field.name} defaultValue={field.defaultValue} disabled={field.disabled} onChange={data.onChange}/>
                            </div>
                        )}

                        {field.type === 'select' && (
                            <div className="modal-field">
                                <label htmlFor={field.name}>{field.title}</label>
                                <select className="select-css" name={field.name} defaultValue={field.defaultValue} onChange={data.onChange}>
                                    {!!field.hiddenValue && <option value="" hidden>{field.hiddenValue}</option>}
                                    {field.listOfSelects.map((item, ind) => (
                                    <option key={ind} value={item.value || item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>

                        )}

                        {field.type === 'checkbox' && (
                            <div className="modal-field">
                                <div style={{display: 'flex'}}>
                                {!field.hidden && (
                                    <input type="checkbox" style={{margin: '5px 10px 0 0'}} id={field.name} name={field.name} defaultChecked={field.defaultValue} onChange={data.onChange} />
                                )}
                                <label htmlFor={field.name}>{field.title}</label>
                            </div>

                            </div>

                        )}


                    </div>
                )
            })}

            {data.errors && (
                <p className={'modal-error'}>{data.errors}</p>
            )}



            {/* <button onClick={data.confirmAction}> SUBMIT </button>
            ({title, onClick, cancel, danger, success}) */}

            <div className="modal-button-container">
                <Button title={'Cancel'} cancel onClick={toggleModal} />
                <Button title={data.confirmActionTitle} onClick={data.confirmAction} />
            </div>

        </div>
    )
}


const renderModalType = (modalType, modalProps, isLoading, toggleModal) => {
    switch (modalType) {
        case 'delete':
            return <DeleteModal data={modalProps} isLoading={isLoading} toggleModal={toggleModal}/>
        case 'alert':
            return <AlertModal data={modalProps} isLoading={isLoading} toggleModal={toggleModal}/>
        case 'prompt':
            return <PromptModal data={modalProps} isLoading={isLoading} toggleModal={toggleModal}/>

        default:
            break;
    }
}


const Modal = ({modalVisible, toggleModal, modalProps, modalType, isLoading}) => {

    let body = document.getElementsByTagName('body')[0].style;
    body.overflow = 'auto'

    // console.log(bodyStyle)

    if(!modalVisible) return null;

    const handleClose = e => {
        return e.currentTarget === e.target && toggleModal();
    }

    body.overflow = 'hidden'
    // console.log(modalProps, 'modalProps')

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

                
                {/* <button onClick={toggleModal}>CLOSE</button> */}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    // console.log(state, 'state in modal')
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
//need to allow for passing functions on confirm