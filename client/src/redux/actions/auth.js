/* eslint-disable import/no-cycle */
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';
import { notification } from 'antd';
import { Site_Name_Short } from 'assets/resourceStrings';
import { request } from './middleware';
import { history, wait } from '../../helpers';
import { AUTH_SET_USER, SET_CURRENT_SEASON } from '../actionTypes';

export const setUser = user => ({ type: AUTH_SET_USER, payload: user });

export const login = loginData => async dispatch => {
    const data = await request({ url: '/api/auth/login', method: 'POST', session: loginData, publicRoute: true });
    if (!data) return false;
    cookie.save(`${Site_Name_Short}_auth_pml`, data.data.access_token);
    // cookie.save('hockeydb_auth', data.data.access_token);
    dispatch(setUser({ ...data.data.user, access_token: data.data.access_token }));
    dispatch({ type: SET_CURRENT_SEASON, payload: data.data.season });

    return true;
};

export const logout = (preventMessage) => async (dispatch) => {
    // cookie.remove('hockeydb_auth');
    cookie.remove(`${Site_Name_Short}_auth_pml`);
    dispatch(setUser({}));
    history.push('/');

    const options = {
        message: 'Success',
        description: 'You have successfully logged out',
        placement: 'topRight',
    };
    if (!preventMessage) {
        notification.success(options);
    }
};


export const loginFromCookie = () => async (dispatch, getState) => {
    // check to make sure there isnt a user already logged in before trying to log a user in (infinite load)
    // first "loginFromCookie" is fired from App.js
    const { user } = getState();
    if (!!Object.keys(user.user).length) return false;
    const access_token = cookie.load(`${Site_Name_Short}_auth_pml`);
    if (!access_token) return false;

    const decoded = jwt.decode(access_token);

    dispatch(setUser({ ...decoded.user, access_token }));
    dispatch({ type: SET_CURRENT_SEASON, payload: decoded.season });

    // USE THIS FOR SERVER SIDE TOKEN AUTH
    // below will check the auth validation in the background

    await wait(1000);

    const data = await request({ url: '/api/auth/login/cookie', method: 'POST', session: access_token });
    // triggered if user is deactivated / suspended
    if (!data) return dispatch(logout(true));

    if (decoded.season.id !== data.data.season.id) {
        return dispatch({ type: SET_CURRENT_SEASON, payload: data.data.season });
    }

    return true;
};
