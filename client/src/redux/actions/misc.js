import { TOGGLE_NAV_SLIDER, TOGGLE_MODAL } from '../actionTypes';

export const toggleNavSlider = () => ({
    type: TOGGLE_NAV_SLIDER
})

// export const toggleModal = (status, message) => ({
//     type: TOGGLE_MODAL,
//     payload: {status, message}
// })


export const toggleModal = (modalProps, modalType) => {

    // console.log(modalProps, modalType, 'yoooo!')
    if(!modalProps){
        var modalProps = {isVisible: false};
    }

    // console.log(modalProps, 'modalprops')

    return  {
        type: TOGGLE_MODAL,
        modalProps,
        modalType
    }
}