import { request } from './middleware';
import { GET_INIT, GET_SUCCESS } from '../actionTypes';

export const getUsers = (filter) => async dispatch => {
    dispatch({ type: `users/${GET_INIT}` });

    // use filter variable or empty string if null/undefined
    const data = await request({ url: `/api/admin/users?${filter || ''}`, method: 'GET', session: {}, publicRoute: true });

    if (!data) return false;

    const payload = data.data.map(item => ({ ...item, full_name: `${item.first_name} ${item.last_name}` }));
    dispatch({ type: `users/${GET_SUCCESS}`, payload });
    return true;
};


export const createUser = userData => async (dispatch) => {
    // console.log(userData, 'CREATE USER YAY');

    // const data = await request(`/api/admin/seasons`, 'POST', {access_token: user.user.access_token, data: seasonData})

    // console.log(data, 'DATA CREATE SEASON!!')

    // if(!data) return false;

    // dispatch({
    //     type: `seasons/${CREATE_SUCCESS}`,
    //     payload: data.data
    // })

    // dispatch({
    //     type: TOGGLE_MODAL,
    //     modalProps: { isVisible: false }
    // })
};
