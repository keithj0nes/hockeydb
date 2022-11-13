import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'universal-cookie';
import { decodeJwt } from 'jose';
import request from '../request';
import { history } from '../../utils';

const COOKIE_NAME = 'USHL_auth_pml';
const cookies = new Cookies();


// initialState looks like {
//     user: {},
//     isAuthenticated: false,
//     access_token,
// };

const checkForToken = () => {
    const access_token = cookies.get(COOKIE_NAME);
    if (!access_token || access_token === 'undefined') {
        return { user: {}, isAuthenticated: false };
    }
    const decoded = decodeJwt(access_token);
    return { user: decoded.user, access_token, isAuthenticated: true };
};

const initialState = checkForToken();

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            const userExists = !!Object.keys(payload).length;
            if (userExists) {
                cookies.set(COOKIE_NAME, payload.access_token, { path: '/' });
            } else {
                cookies.remove(COOKIE_NAME, { path: '/' });
            }

            state.user = payload;
            state.isAuthenticated = userExists;
            state.access_token = payload.access_token;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setUser } = authSlice.actions;


export const login = loginData => async dispatch => {
    const data = await request({ url: '/api/auth/login', method: 'POST', body: loginData, isPublic: true });

    // if (data.error) return alert(data.message);
    if (!data) return false;
    dispatch(setUser({ ...data.data.user, access_token: data.data.access_token }));
    history.push(loginData.redirect || '/dashboard');
    return true;
};

// TODO: add login from cookie to add ability to check if user is suspended on token account

export const logout = () => async (dispatch) => {
    dispatch(setUser({}));
    history.push('/');
};

export const createAccount = (userData) => async () => {
    const data = await request({ url: '/api/auth/signup', method: 'POST', body: userData, isPublic: true });
    if (!data) return false;
    return true;
};

export default authSlice.reducer;
