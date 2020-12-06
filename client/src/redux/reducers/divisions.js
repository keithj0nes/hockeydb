import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, REMOVE_HIDDEN, DELETE_SUCCESS } from '../actionTypes';

const initialDivisionState = {
    isLoading: false,
    divisions: [],
    selectedSeasonName: '',
    // filter
    isVisible: false,
};

export const divisions = (state = initialDivisionState, { type, payload }) => {
    switch (type) {
    case `divisions/${GET_INIT}`:
        return { ...state, isLoading: true };
    case `divisions/${GET_SUCCESS}`:
        return { ...state, isLoading: false, divisions: payload };
    case `divisions/${CREATE_SUCCESS}`:
        return { ...state, isLoading: false, divisions: [...state.divisions, payload] };
    case `divisions/${UPDATE_SUCCESS}`: {
        const newDivisions = state.divisions.map(item => ((item.id === payload.id) ? payload : item));
        return { ...state, isLoading: false, divisions: newDivisions };
    }
    case `divisions/${DELETE_SUCCESS}`:
    case `divisions/${REMOVE_HIDDEN}`:
        return { ...state, isLoading: false, divisions: state.divisions.filter(item => item.id !== payload.id) };
    case 'divisions/FILTER_IS_VISIBLE':
        // if the payload is NOT undefined, use the payload (generally set to false in componentwillunmount)
        // otherwise just set it to the opposite of what it's currently set to
        return { ...state, isVisible: typeof (payload) !== 'undefined' ? payload : !state.isVisible };
    default:
        return state;
    }
};
