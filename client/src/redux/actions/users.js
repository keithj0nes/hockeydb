import { request } from './middleware';
import { GET_INIT, GET_SUCCESS } from '../actionTypes';

export const getUsers = (filter) => async dispatch => {
    dispatch({ type: `users/${GET_INIT}` });

    // use filter variable or empty string if null/undefined
    const data = await request(`/api/admin/users?${filter || ''}`, 'GET', {}, true);
    if (!data) return false;

    const payload = data.data.map(item => ({ ...item, full_name: `${item.first_name} ${item.last_name}` }));
    dispatch({ type: `users/${GET_SUCCESS}`, payload });
    return true;
};
