import { createSlice } from '@reduxjs/toolkit';
import cookie from 'react-cookies';
// import jwt from 'jsonwebtoken';
import { decodeJwt } from 'jose';
import request from '../request';
import { history } from '../../utils';

const Site_Name_Short = 'USHL';


// const initialState = {
//     user: {},
//     isAuthenticated: false,
//     access_token,
// };


const checkForToken = () => {
    const access_token = cookie.load(`${Site_Name_Short}_auth_pml`);
    // console.log(access_token, 'access_token')

    if (!access_token) {
        return { user: {}, isAuthenticated: false };
    }

    const decoded = decodeJwt(access_token);
    // console.log(decoded, 'decoded')

    // const decoded = jwt.decode(access_token);
    return { user: decoded.user, access_token, isAuthenticated: true };
};

// console.log(checkForToken(), 'checking for tken');

const initialState = checkForToken();


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, { payload }) => {
            console.log(payload, ' payload');
            state.user = payload;
            state.isAuthenticated = !!Object.keys(payload).length;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setUser } = authSlice.actions;

// export default counterSlice.reducer


export const login = loginData => async dispatch => {
    console.log(loginData, 'login data!')
    const data = await request({ url: '/api/auth/login', method: 'POST', session: loginData, publicRoute: true });
    console.log(data,' dtaataaa')

    if (data.error) return alert(data.message);
    if (!data) return false;
    cookie.save(`${Site_Name_Short}_auth_pml`, data.data.access_token);
    dispatch(setUser({ ...data.data.user, access_token: data.data.access_token }));
    // dispatch({ type: SET_CURRENT_SEASON, payload: data.data.season });

    console.log(history, 'history!!')
    history.push(loginData.redirect || '/dashboard');
    // return true;
};

// TODO: add login from cookie to add ability to check if user is suspended on token account

export const logout = (preventMessage) => async (dispatch) => {
    // cookie.remove('hockeydb_auth');
    cookie.remove(`${Site_Name_Short}_auth_pml`);
    dispatch(setUser({}));
    history.push('/');

    console.log('LOGGED OUT!!')

    // const options = {
    //     message: 'Success',
    //     description: 'You have successfully logged out',
    //     placement: 'topRight',
    // };
    // if (!preventMessage) {
    //     notification.success(options);
    // }
};

export default authSlice.reducer;
