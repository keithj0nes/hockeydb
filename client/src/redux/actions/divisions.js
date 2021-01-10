/* eslint-disable no-param-reassign */
import { request } from './middleware';
import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL, REMOVE_HIDDEN, DELETE_SUCCESS } from '../actionTypes';

export const getDivisions = (filter) => async (dispatch, getState) => {
    dispatch({ type: `divisions/${GET_INIT}` });
    // revisit this !!!!!
    const { seasons: { currentSeason } } = getState();
    if (!filter) {
        filter = `?season=${currentSeason.name}`;
    } else if (!filter.includes('season')) {
        filter += `&season=${currentSeason.name}`;
    }

    // use filter variable or empty string if null/undefined
    const data = await request({ url: `/api/divisions${filter || ''}`, method: 'GET', session: {}, publicRoute: true });
    if (!data) return false;

    dispatch({ type: `divisions/${GET_SUCCESS}`, payload: data.data.divisions });
    dispatch({ type: `seasons/${GET_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });

    return true;
};


export const createDivision = ({ divisionData }) => async (dispatch) => {
    const data = await request({ url: '/api/admin/divisions', method: 'POST', session: divisionData });
    if (!data) return false;

    dispatch({ type: `divisions/${CREATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
};


export const updateDivision = ({ id, divisionData }) => async (dispatch) => {
    const data = await request({ url: `/api/admin/divisions/${id}`, method: 'PUT', session: divisionData });
    if (!data) return false;

    dispatch({ type: `divisions/${UPDATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });

    if ('is_hidden' in divisionData) {
        dispatch({ type: `divisions/${REMOVE_HIDDEN}`, payload: data.data });
        return { is_hidden: data.data.is_hidden };
    }

    return true;
};


export const deleteDivision = ({ id }) => async (dispatch) => {
    const data = await request({ url: `/api/admin/divisions/${id}`, method: 'DELETE' });
    if (!data) return false;

    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    dispatch({ type: `divisions/${DELETE_SUCCESS}`, payload: data.data });

    return true;
};
