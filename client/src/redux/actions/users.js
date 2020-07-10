import { request } from './middleware';
// import { GET_INIT, GET_SUCCESS, UPDATE_SUCCESS, CREATE_SUCCESS } from '../actionTypes';
import { GET_INIT, GET_SUCCESS } from '../actionTypes';
import { wait } from '../../helpers';


export const getUsers = (filter) => async dispatch => {

    dispatch({ type: `users/${GET_INIT}` })

    // await wait(3000);

    //use filter variable or empty string if null/undefined
    const data = await request(`/api/admin/users?${filter || ''}`, 'GET', {}, true)
    if(!data) return false;

    const payload = data.data.map(item => {
            return {...item, full_name: `${item.first_name} ${item.last_name}`}
    });

    dispatch({
        type: `users/${GET_SUCCESS}`,
        payload
    })

    // dispatch({
    //     type: TOGGLE_MODAL,
    //     modalProps: { isVisible: false }
    // })

    return true;
}
