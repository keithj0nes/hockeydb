// teams REDUCER!!

import { GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS } from '../actionTypes';

const initialteamstate = {
    isLoading: true,
    teams: [],
    //filter
    isVisible: false,
    
  };
  
export const teams = (state = initialteamstate, { type, payload }) => {
    switch (type) {
    case 'teams/GET':
        return { ...state, isLoading: true }
    case `teams/${GET_SUCCESS}`:
        return { ...state, isLoading: false, teams: payload }
    case `teams/${CREATE_SUCCESS}`:
        // return { ...state, isLoading: false, teams: [payload, ...state.teams]}
        return { ...state, isLoading: false, teams: [...state.teams, payload] }
    case `teams/${UPDATE_SUCCESS}`:
        const newteams = state.teams.map(item => {
            if(item.id === payload.id){
                return payload
            } else if(payload.is_active){
                return {...item, is_active: false}
            }
            return item;
            })
        return  { ...state, isLoading: false, teams: newteams }
    case 'teams/FILTER_IS_VISIBLE':
        console.log('in here')
        //if the payload is NOT undefined, use the payload (generally set to false in componentwillunmount)
        //otherwise just set it to the opposite of what it's currently set to
        return { ...state, isVisible: typeof(payload) !== 'undefined' ? payload : !state.isVisible }
        
    default:
        return state;
    }
};