// import axios from 'axios';
import { request } from './middleware';
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';
import { JWTSECRET } from '../../client_config';
import { AUTH_SET_USER, SET_CURRENT_SEASON } from '../actionTypes';



export const setUser = user => ({ type: AUTH_SET_USER, payload: user })

export const login = loginData => async dispatch => {

  const data = await request('/api/auth/login', 'POST', {data: loginData}, true)
  if(!data) return false;
  // console.log(data, 'data!')
  cookie.save('auth', data.data.access_token);
  dispatch(setUser( data.data.user ))
  dispatch({type: SET_CURRENT_SEASON, payload: data.data.season})
  return true;
}

export const logout = () => (dispatch, getState) => {
  cookie.remove('auth');
  dispatch(setUser({}))
}


export const loginFromCookie = () => async dispatch => {
  const access_token = cookie.load('auth');
  if(!access_token) return;

  //USE THIS FOR SERVER SIDE TOKEN AUTH
  // const data = await request('/api/auth/login/cookie', 'POST', {access_token})
  // console.log(data, 'DATA!')
  // dispatch(setUser({...data.user, access_token}))
  // dispatch({type: SET_SEASON, payload: data.season})

  
  //USING THIS FOR CLIENT SIDE TOKEN AUTH (FASTER)
  const signed = jwt.verify(access_token, JWTSECRET)
  // console.log(signed, 'signeD!')

  dispatch(setUser({...signed.user, access_token}))
  dispatch({type: SET_CURRENT_SEASON, payload: signed.season})

}