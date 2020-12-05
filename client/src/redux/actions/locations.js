import { request } from './middleware';
import { GET_INIT, GET_SUCCESS, DELETE_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL } from '../actionTypes';


export const getLocations = (filter) => async dispatch => {
    dispatch({ type: `locations/${GET_INIT}` });
    const data = await request({ url: `/api/locations?${filter || ''}`, method: 'GET', session: {}, publicRoute: true });

    if (!data.data) return false;
    dispatch({ type: `locations/${GET_SUCCESS}`, payload: data.data });
    return true;
};

export const createLocation = ({ locationData }) => async (dispatch) => {
    const data = await request({ url: '/api/admin/locations', method: 'POST', session: locationData });
    if (!data.data) return false;
    dispatch({ type: `locations/${CREATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
};

export const updateLocation = ({ id, locationData }) => async (dispatch) => {
    const data = await request({ url: `/api/admin/locations/${id}`, method: 'PUT', session: locationData });
    if (!data) return false;
    dispatch({ type: `locations/${UPDATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
};

export const deleteLocation = ({ id }) => async (dispatch) => {
    const data = await request({ url: `/api/admin/locations/${id}`, method: 'DELETE' });
    if (!data) return false;
    dispatch({ type: `locations/${DELETE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
};
