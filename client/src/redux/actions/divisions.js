/* eslint-disable no-param-reassign */
import { request } from './middleware';
import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL } from '../actionTypes';

export const getDivisions = (filter) => async (dispatch, getState) => {
    dispatch({ type: `divisions/${GET_INIT}` });

    const { seasons: { currentSeason } } = getState();
    // use filter variable if empty string or null/undefined
    // revisit this !!!!!
    if (!filter) {
        filter = `season=${currentSeason.name}`;
    } else if (!filter.includes('season')) {
        filter += `&season=${currentSeason.name}`;
    }

    // use filter variable or empty string if null/undefined
    const data = await request({ url: `/api/divisions?${filter || ''}`, method: 'GET', session: {}, publicRoute: true });

    if (!data) return false;

    dispatch({ type: `divisions/${GET_SUCCESS}`, payload: data.data.divisions });
    dispatch({ type: `seasons/${GET_SUCCESS}`, payload: data.data.seasons });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });

    return true;
};


export const createDivision = (divisionData) => async (dispatch) => {
    const data = await request({ url: '/api/admin/divisions', method: 'POST', session: divisionData });

    if (!data) return false;

    dispatch({ type: `divisions/${CREATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });

    return true;
};


export const updateDivision = (id, divisionData) => async (dispatch) => {
    const data = await request({ url: `/api/admin/divisions/${id}`, method: 'PUT', session: divisionData });
    if (!data) return false;

    // NOT CONNNECTED YET
    dispatch({ type: `divisions/${UPDATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });

    if (data.message === 'Division hidden' || data.message === 'Division unhidden') {
    // after hiding/unhiding, getDivisions again with filters
        return 'getDivisions';
    }
    return true;
};


export const deleteDivision = (id, season) => async (dispatch) => {
    const data = await request({ url: `/api/admin/divisions/${id}`, method: 'DELETE' });

    if (!data) return false;

    // Close Delete Modal
    // dispatch({
    //     type: TOGGLE_MODAL,
    // })

    // Open Alert Modal
    dispatch({
        type: TOGGLE_MODAL,
        modalProps: {
            isVisible: true,
            title: 'Delete Division',
            message: data.message,
        },
        modalType: 'alert',
    });

    // fix this using redux state
    return dispatch(getDivisions(season && `season=${season}`));
};
