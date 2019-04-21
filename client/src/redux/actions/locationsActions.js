import { request } from './middleware';
import { NEW_LOCATION, GET_LOCATIONS } from '../actionTypes';


export const getLocations = () => async dispatch => {
  const data = await request('/api/locations', 'GET', {}, true)
  if (!data.data) return false;
  dispatch({ type: GET_LOCATIONS, payload: data.data })
  return true;
}

export const newLocation = (data) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/locations', 'POST', { data, access_token: user.user.access_token })
  if (!post.data) return false;
  dispatch({ type: NEW_LOCATION, payload: post.data })
  return true;
}
