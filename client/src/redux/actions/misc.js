import { TOGGLE_NAV_SLIDER, TOGGLE_MODAL } from '../actionTypes';

export const toggleNavSlider = () => ({
    type: TOGGLE_NAV_SLIDER,
})

export const toggleModal = (modalProps, modalType) => {
    if(!modalProps){
        modalProps = { isVisible: false };
    }

    return  {
        type: TOGGLE_MODAL,
        modalProps,
        modalType,
    }
}

export const toggleFilter = (section, bool) => ({
    type: `${section}/FILTER_IS_VISIBLE`,
    payload: bool,
})

export const closeSnackBar = () => ({
    type: 'TOGGLE_SNACKBAR',
})
