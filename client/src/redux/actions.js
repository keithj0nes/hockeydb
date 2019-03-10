import axios from 'axios';
import { LoginContext } from '../components/auth/context';

const API = 'http://localhost:8010';

export const setUser = user => ({ type: 'AUTH_SET_USER', payload: user })

export const login = loginData => dispatch => {
  console.log(loginData);

  axios
    .post(`${API}/api/auth/login`, loginData)
    .then(response => {
      dispatch(setUser({ user: response.data.data, access_token: response.data.token }))
    })
    .catch(console.error);


}

export const logOut = () => (dispatch, getState) => {

  const { user } = getState();

  axios
    .post(`${API}/api/auth/${user.id}/logout`)
    .then(response => {
      dispatch(setUser(response.data))
    })
    .catch(console.error);
}