// import axios from 'axios';
import { request } from './middleware';
import cookie from 'react-cookies';
// import jwt from 'jsonwebtoken';
// import { JWTSECRET } from '../../client_config';
import { AUTH_SET_USER, SET_CURRENT_SEASON } from '../actionTypes';
// import { AUTH_SET_USER, SET_CURRENT_SEASON, GET_SUCCESS } from '../actionTypes';



export const setUser = user => ({ type: AUTH_SET_USER, payload: user })

export const login = loginData => async dispatch => {

  const data = await request('/api/auth/login', 'POST', {data: loginData}, true)
  if(!data) return false;
  // console.log(data, 'data!')
  cookie.save('auth', data.data.access_token);
  dispatch(setUser( data.data.user ))
  dispatch({type: SET_CURRENT_SEASON, payload: data.data.season})
  // dispatch({type: `seasons/${GET_SUCCESS}`, payload: data.data.seasons})

  return true;
}

export const logout = () => (dispatch, getState) => {
  cookie.remove('auth');
  dispatch(setUser({}))
}


export const loginFromCookie = () => async dispatch => {
  const access_token = cookie.load('auth');
  if(!access_token) return false;

  //USE THIS FOR SERVER SIDE TOKEN AUTH
  const data = await request('/api/auth/login/cookie', 'POST', {access_token})
  console.log(data, 'DATA!')

  //triggered if user is deactivated / suspended
  if(!data) return dispatch(logout());

  // if(!data){
  //   dispatch(logout());
  //   return false;
  // }

  dispatch(setUser({...data.data.user, access_token}))
  dispatch({type: SET_CURRENT_SEASON, payload: data.data.season})
  // dispatch({type: `seasons/${GET_SUCCESS}`, payload: data.data.seasons})

  
  //USING THIS FOR CLIENT SIDE TOKEN AUTH (FASTER)
  // const signed = jwt.verify(access_token, JWTSECRET)
  // // console.log(signed, 'signeD!')

  // dispatch(setUser({...signed.user, access_token}))
  // dispatch({type: SET_CURRENT_SEASON, payload: signed.season})
  return true;

}