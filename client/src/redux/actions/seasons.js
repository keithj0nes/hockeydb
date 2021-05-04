import { request } from './middleware';
import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL, SET_CURRENT_SEASON, REMOVE_HIDDEN } from '../actionTypes';

export const getSeasons = (filter) => async dispatch => {
    // if less than 1 second of load time, dont show loading - may cause "flashing"
    const to = setTimeout(() => {
        dispatch({ type: `seasons/${GET_INIT}` });
    }, 1000);
    // use filter variable or empty string if null/undefined
    const data = await request({ url: `/api/seasons${filter || ''}`, method: 'GET', session: {}, publicRoute: true });
    clearTimeout(to);
    dispatch({ type: 'seasons/stop_loading' });
    if (!data) return false;
    dispatch({ type: `seasons/${GET_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });

    return true;
};

export const createSeason = ({ seasonData }) => async (dispatch) => {
    const data = await request({ url: '/api/admin/seasons', method: 'POST', session: seasonData });
    if (!data) return false;
    dispatch({ type: `seasons/${CREATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
};

export const updateSeason = ({ id, seasonData }) => async (dispatch) => {
    const data = await request({ url: `/api/admin/seasons/${id}`, method: 'PUT', session: seasonData });
    if (!data) return false;
    dispatch({ type: `seasons/${UPDATE_SUCCESS}`, payload: data.data });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });

    if (data.data.updateCurrentSeasonGlobally) {
        dispatch({ type: SET_CURRENT_SEASON, payload: data.data });
    }

    if ('is_hidden' in seasonData) {
        dispatch({ type: `seasons/${REMOVE_HIDDEN}`, payload: data.data.id });
        return { is_hidden: data.data.is_hidden };
    }

    return true;
};

export const deleteSeason = ({ id }) => async (dispatch) => {
    const data = await request({ url: `/api/admin/seasons/${id}`, method: 'DELETE' });
    if (!data) return false;
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    // // // // // // //
    // change this to update redux instead of new get request
    // // // // // // //
    return dispatch(getSeasons());
};
