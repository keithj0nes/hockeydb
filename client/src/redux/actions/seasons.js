import { request } from './middleware';
import { GET_SEASONS, GET_SEASONS_SUCCESS } from '../actionTypes';


export const getSeasons = () => async dispatch => {
    const data = await request('/api/seasons', 'GET', {}, true)

    dispatch({
        type: GET_SEASONS_SUCCESS,
        payload: data
    })
    
    //simulate db
    
    // setTimeout(() => {
    //     dispatch({
    //         type: GET_SEASONS_SUCCESS,
    //         payload: seasonData
    //     })
    // }, 2000);
}

export const deleteSeason = id => async (dispatch, getState) => {

    const { user } = getState();

    const data = await request(`/api/admin/seasons/${id}`, 'DELETE', {access_token: user.access_token})

    console.log(data, 'DATA!')
}


const seasonData = [
    {
        id: 1,
        type: 'Regular',
        name: 'Summer 2019'
    },
    {
        id: 2,
        type: 'Playoffs',
        name: 'Fall/Winter Playoffs 2019'
    },
    {
        id: 3,
        type: 'Regular',
        name: 'Fall/Winter 2019'
    }
]