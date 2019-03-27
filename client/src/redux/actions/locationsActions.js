import { request } from './middleware';
import { NEW_LOCATION, GET_LOCATIONS } from '../actionTypes';



export const sendNewLocation = data => ({ type: NEW_LOCATION, payload: data })
export const sendLocation = data => ({ type: GET_LOCATIONS, payload: data })

export const getLocations = () => async dispatch => {
  const data = await request('/api/locations', 'GET', {}, true)
  if (!data) return false;
  dispatch(sendLocation(data))
  return true;
}

export const newLocation = (name, address) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/locations', 'POST', { data: { name: name, address: address }, access_token: user.user.access_token })
  if (!post) return false;
  dispatch(sendNewLocation(post))
  return true;
}
