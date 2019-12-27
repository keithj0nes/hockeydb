import { request } from './middleware';
// import { GET_SEASONS, GET_SEASONS_SUCCESS, TOGGLE_MODAL } from '../actionTypes';
import { GET_SEASONS_SUCCESS, CREATE_SEASON_SUCCESS, UPDATE_SEASON_SUCCESS, TOGGLE_MODAL, SET_CURRENT_SEASON } from '../actionTypes';



export const getSeasons = () => async dispatch => {
    const data = await request('/api/seasons', 'GET', {}, true)

    dispatch({
        type: GET_SEASONS_SUCCESS,
        payload: data.data
    })
    
    //simulate db
    
    // setTimeout(() => {
    //     dispatch({
    //         type: GET_SEASONS_SUCCESS,
    //         payload: seasonData
    //     })
    // }, 2000);
}

export const createSeason = seasonData => async (dispatch, getState) => {
    const { user } = getState();

    console.log(seasonData, 'SEASON DATA!')

    const data = await request(`/api/admin/seasons`, 'POST', {access_token: user.access_token, data: seasonData})

    console.log(data, 'DATA CREATE SEASON!!')

    if(!data) return;


    dispatch({
        type: CREATE_SEASON_SUCCESS,
        payload: data.data
    })

    dispatch({
        type: TOGGLE_MODAL,
        modalProps: { isVisible: false }
    })
}

export const updateSeason = (id, seasonData) => async (dispatch, getState) => {
    const { user } = getState();

    const data = await request(`/api/admin/seasons/${id}`, 'PUT', {access_token: user.access_token, data: seasonData})

    console.log(data, 'DATA IN UPDATE SEASON ACTIONS')
    if(!data) return;



    //NOT CONNNECTED YET
    dispatch({
        type: UPDATE_SEASON_SUCCESS,
        payload: data.data
    })

    if(data.data.updateCurrentSeasonGlobally){
        console.log('setting globally!')
        dispatch({
            type: SET_CURRENT_SEASON,
            payload: data.data
        })
    }

    dispatch({
        type: TOGGLE_MODAL,
        modalProps: { isVisible: false }
    })

    
}

export const deleteSeason = id => async (dispatch, getState) => {

    const { user } = getState();

    const data = await request(`/api/admin/seasons/${id}`, 'DELETE', {access_token: user.access_token})

    console.log(data, 'DATA!')

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
    return data
}


// const seasonData = [
//     {
//         id: 1,
//         type: 'Regular',
//         name: 'Summer 2019'
//     },
//     {
//         id: 2,
//         type: 'Playoffs',
//         name: 'Fall/Winter Playoffs 2019'
//     },
//     {
//         id: 3,
//         type: 'Regular',
//         name: 'Fall/Winter 2019'
//     }
// ]