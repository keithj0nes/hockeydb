import { GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS } from '../actionTypes';

const initialDivisionState = {
    isLoading: true,
    divisions: [],
    //filter
    isVisible: false,
    
  };
  
export const divisions = (state = initialDivisionState, { type, payload }) => {
    switch (type) {
    case 'divisions/GET':
        return { ...state, isLoading: true }
    case `divisions/${GET_SUCCESS}`:
        console.log('payload:::', payload)
        return { ...state, isLoading: false, divisions: payload }
    case `divisions/${CREATE_SUCCESS}`:
        // return { ...state, isLoading: false, divisions: [payload, ...state.divisions]}
        return { ...state, isLoading: false, divisions: [...state.divisions, payload] }
    case `divisions/${UPDATE_SUCCESS}`:
        const newDivisions = state.divisions.map(item => {
            if(item.id === payload.id){
                return payload
            } else if(payload.is_active){
                return {...item, is_active: false}
            }
            return item;
            })
        return  { ...state, isLoading: false, divisions: newDivisions }
    case 'divisions/FILTER_IS_VISIBLE':
        //if the payload is NOT undefined, use the payload (generally set to false in componentwillunmount)
        //otherwise just set it to the opposite of what it's currently set to
        return { ...state, isVisible: typeof(payload) !== 'undefined' ? payload : !state.isVisible }
        
    default:
        return state;
    }
};