import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS } from '../actionTypes';

const initialLocationsState = {
    isLoading: true,
    locations: [],

    // filter
    isVisible: false,
};
  
export const locations = (state = initialLocationsState, { type, payload }) => {
    switch (type) {
    case `locations/${GET_INIT}`: //not being used yet
        return { ...state, isLoading: true }
    case `locations/${GET_SUCCESS}`:
        return { ...state, isLoading: false, locations: payload }
    case `locations/${CREATE_SUCCESS}`:
        // return { ...state, isLoading: false, seasons: [payload, ...state.seasons]}
        return { ...state, isLoading: false, locations: [...state.locations, payload] }
    case `locations/${UPDATE_SUCCESS}`:
        // update item without getting whole list again
        const newLocations = state.locations.map(item => {
            if(item.id === payload.id){
                return payload
            }
            return item;
        })
        return  { ...state, isLoading: false, locations: newLocations }
    case 'locations/FILTER_IS_VISIBLE':
        //if the payload is NOT undefined, use the payload (generally set to false in componentwillunmount)
        //otherwise just set it to the opposite of what it's currently set to
        return { ...state, isVisible: typeof(payload) !== 'undefined' ? payload : !state.isVisible }
        
    default:
        return state;
    }
};