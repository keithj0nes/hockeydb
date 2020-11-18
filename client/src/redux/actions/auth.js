/* eslint-disable import/no-cycle */
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';
import { request } from './middleware';
import { AUTH_SET_USER, SET_CURRENT_SEASON } from '../actionTypes';


export const setUser = user => ({ type: AUTH_SET_USER, payload: user });

export const login = loginData => async dispatch => {
    // const data = await request('/api/auth/login', 'POST', { data: loginData }, true);
    const data = await request({ url: '/api/auth/login', method: 'POST', session: loginData, publicRoute: true });

    if (!data) return false;
    cookie.save('hockeydb_auth', data.data.access_token);
    dispatch(setUser({ ...data.data.user, access_token: data.data.access_token }));
    dispatch({ type: SET_CURRENT_SEASON, payload: data.data.season });
    // dispatch({type: `seasons/${GET_SUCCESS}`, payload: data.data.seasons})

    return true;
};

export const logout = () => (dispatch, getState) => {
    // console.log('logout --------- ');
    cookie.remove('hockeydb_auth');
    // console.log(cookie.load('hockeydb_auth'), 'load cookie after logout');
    dispatch(setUser({}));
    console.log('togglin!!')
    dispatch({
        type: 'TOGGLE_SNACKBAR',
        payload: { isVisible: true, message: "You've successfully logged out", type: 'alert' },
    });
};


export const loginFromCookie = () => async dispatch => {
    const access_token = cookie.load('hockeydb_auth');
    if (!access_token) return false;

    const decoded = jwt.decode(access_token);

    dispatch(setUser({ ...decoded.user, access_token }));
    dispatch({ type: SET_CURRENT_SEASON, payload: decoded.season });

    // USE THIS FOR SERVER SIDE TOKEN AUTH
    // calling this request gives a flash in the ui
    // const data = await request('/api/auth/login/cookie', 'POST', { access_token });
    const data = await request({ url: '/api/auth/login/cookie', method: 'POST', session: access_token });
    // triggered if user is deactivated / suspended
    if (!data) return dispatch(logout());

    if (decoded.season.id !== data.data.season.id) {
        dispatch({ type: SET_CURRENT_SEASON, payload: data.data.season });
    }

    // dispatch(setUser({ ...data.data.user, access_token }));
    // dispatch({ type: SET_CURRENT_SEASON, payload: data.data.season });
    // dispatch({type: `seasons/${GET_SUCCESS}`, payload: data.data.seasons})

    return true;
};
