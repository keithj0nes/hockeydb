import { request } from './middleware';
import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL } from '../actionTypes';


export const getLocations = () => async dispatch => {
    dispatch({ type: `locations/${GET_INIT}` });
    const data = await request('/api/locations', 'GET', {}, true);
    if (!data.data) return false;
    dispatch({ type: `locations/${GET_SUCCESS}`, payload: data.data });
    return true;
}

export const createLocation = (data) => async (dispatch, getState) => {
    const { user } = getState();
    const post = await request('/api/admin/locations', 'POST', { data, access_token: user.user.access_token });
    if (!post.data) return false;
    dispatch({ type: `locations/${CREATE_SUCCESS}`, payload: post.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
}

export const updateLocation = (id, locationData) => async (dispatch, getState) => {
    const { user } = getState();
    const data = await request(`/api/admin/locations/${id}`, 'PUT', {access_token: user.user.access_token, data: locationData});
    if(!data) return false;
    dispatch({ type: `locations/${UPDATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
}

export const deleteLocation = id => async (dispatch, getState) => {
    const { user } = getState();
    const data = await request(`/api/admin/locations/${id}`, 'DELETE', {access_token: user.user.access_token})
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
            title: 'Delete Location',
            message: data.message
        },
        modalType: 'alert'
    })
    // return data
    return dispatch(getLocations());
}
