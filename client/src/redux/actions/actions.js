// import axios from 'axios';
import { request } from './middleware';
import cookie from 'react-cookies';

export const setUser = user => ({ type: 'AUTH_SET_USER', payload: user })

export const login = loginData => async dispatch => {
  console.log(loginData);

  // const data = await axios.post(`${API}/api/auth/login`, loginData).catch(err => console.log(err, 'err in login'));

  //getMiddle
  const data = await request('/api/auth/login', 'POST', loginData, dispatch, 'unauthenticated')
  console.log(data, 'data!')
  cookie.save('auth', data.access_token);

      dispatch(setUser( data ))
    


}

export const logout = () => (dispatch, getState) => {

  cookie.remove('auth');
  dispatch(setUser({}))

}