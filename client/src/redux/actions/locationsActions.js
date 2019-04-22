import { request } from './middleware';
import { NEW_LOCATION, GET_LOCATIONS, TOGGLE_MODAL } from '../actionTypes';


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


export const deleteLocation = id => async (dispatch, getState) => {

  const { user } = getState();

  const data = await request(`/api/admin/locations/${id}`, 'DELETE', {access_token: user.access_token})

  console.log(data, 'DATA!')

  if(!data) return
  //Close Delete Modal
  dispatch({
      type: TOGGLE_MODAL,
  })

  //Open Alert Modal
  dispatch({
      type: TOGGLE_MODAL,
      modalProps: {
          title: 'Delete Location',
          message: data.message
      },
      modalType: 'alert'
  })
  return data
}
