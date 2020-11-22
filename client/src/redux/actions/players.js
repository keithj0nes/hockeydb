import { request } from './middleware';
import { GET_PLAYERS } from '../actionTypes';

export const getPlayers = () => async dispatch => {
    const data = await request('/api/players', 'GET', {}, true);
    if (!data.data) return false;
    dispatch({ type: GET_PLAYERS, payload: data.data });
    return true;
};
