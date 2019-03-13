// import axios from 'axios';
import { request } from './middleware';
import cookie from 'react-cookies';
import jwt from 'jsonwebtoken';
import { JWTSECRET } from '../../client_config';

export const setUser = user => ({ type: 'AUTH_SET_USER', payload: user })

export const login = loginData => async dispatch => {

  const data = await request('/api/auth/login', 'POST', {data: loginData}, true)
  console.log(data, 'data!')
  cookie.save('auth', data.access_token);
  dispatch(setUser( data ))
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
  // dispatch(setUser({...data, access_token}))
  
  //USING THIS FOR CLIENT SIDE TOKEN AUTH (FASTER)
  const signed = jwt.verify(access_token, JWTSECRET)
  dispatch(setUser({...signed.user, access_token}))
}