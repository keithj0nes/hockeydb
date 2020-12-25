import { request } from './middleware';
import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL } from '../actionTypes';

export const getUsers = (filter) => async dispatch => {
    dispatch({ type: `users/${GET_INIT}` });

    // use filter variable or empty string if null/undefined
    const data = await request({ url: `/api/admin/users?${filter || ''}`, method: 'GET', session: {}, publicRoute: true });

    if (!data) return false;

    // const payload = data.data.map(item => ({ ...item, full_name: `${item.first_name} ${item.last_name}` }));
    dispatch({ type: `users/${GET_SUCCESS}`, payload: data.data });
    return true;
};


export const createUser = ({ userData }) => async (dispatch) => {
    const data = await request({ url: '/api/auth/invite', method: 'POST', session: userData });
    if (!data) return false;

    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    dispatch({ type: `users/${CREATE_SUCCESS}`, payload: data.data });
    return true;
};

export const resendInvite = ({ user_id }) => async (dispatch) => {
    console.log(user_id)
    const data = await request({ url: `/api/auth/invite/${user_id}`, method: 'PUT', session: {} });
    console.log({data})

    dispatch({ type: `users/${UPDATE_SUCCESS}/reinvite`, payload: {...data.data, user_id } });
};
