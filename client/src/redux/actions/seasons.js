import { request } from './middleware';
import { GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL, SET_CURRENT_SEASON } from '../actionTypes';



export const getSeasons = (filter) => async dispatch => {

    console.log(filter, 'FILTER GET SEASONS')

    //use filter variable or empty string if null/undefined
    const data = await request(`/api/seasons?${filter || ''}`, 'GET', {}, true)
    if(!data) return false;

    dispatch({
        type: `seasons/${GET_SUCCESS}`,
        payload: data.data
    })

    dispatch({
        type: TOGGLE_MODAL,
        modalProps: { isVisible: false }
    })

    return true;
}

export const createSeason = seasonData => async (dispatch, getState) => {
    const { user } = getState();

    const data = await request(`/api/admin/seasons`, 'POST', {access_token: user.user.access_token, data: seasonData})

    console.log(data, 'DATA CREATE SEASON!!')

    if(!data) return false;

    dispatch({
        type: `seasons/${CREATE_SUCCESS}`,
        payload: data.data
    })

    dispatch({
        type: TOGGLE_MODAL,
        modalProps: { isVisible: false }
    })
}

export const updateSeason = (id, seasonData) => async (dispatch, getState) => {
    console.log('yo yo yo')

    const { user } = getState();

    const data = await request(`/api/admin/seasons/${id}`, 'PUT', {access_token: user.user.access_token, data: seasonData})
    if(!data) return false;

    dispatch({
        type: `seasons/${UPDATE_SUCCESS}`,
        payload: data.data
    })
    
    dispatch({
        type: TOGGLE_MODAL,
        modalProps: { isVisible: false }
    })
    
    if(data.data.updateCurrentSeasonGlobally){
        dispatch({
            type: SET_CURRENT_SEASON,
            payload: data.data
        })
    }
    
    if(data.message === 'Season hidden' || data.message === 'Season unhidden'){
        // after hiding/unhiding, getSeasons again with filters
        return 'getSeasons';
    }
}

export const deleteSeason = id => async (dispatch, getState) => {

    const { user } = getState();

    const data = await request(`/api/admin/seasons/${id}`, 'DELETE', {access_token: user.user.access_token})

    console.log(data, 'DATA!')
    if(!data) return false;

    //Close Delete Modal
    // dispatch({
    //     type: TOGGLE_MODAL,
    // })

    //Open Alert Modal
    dispatch({
        type: TOGGLE_MODAL,
        modalProps: {
            isVisible: true,
            title: 'Delete Season',
            message: data.message
        },
        modalType: 'alert'
    })
    // return data

    return dispatch(getSeasons())

}
