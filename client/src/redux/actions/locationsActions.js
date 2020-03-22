import { request } from './middleware';
// import { NEW_LOCATION, GET_LOCATIONS, TOGGLE_MODAL, UPDATE_SUCCESS } from '../actionTypes';
import { GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL } from '../actionTypes';



export const getLocations = () => async dispatch => {
  const data = await request('/api/locations', 'GET', {}, true);
  console.log(data, 'data')
  if (!data.data) return false;
  dispatch({ type: `locations/${GET_SUCCESS}`, payload: data.data })
  return true;
}

export const createLocation = (data) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/locations', 'POST', { data, access_token: user.user.access_token });
  console.log(post, 'CREcreateLocation')
  if (!post.data) return false;

  dispatch({ type: `locations/${CREATE_SUCCESS}`, payload: post.data });

  dispatch({
    type: TOGGLE_MODAL,
    modalProps: { isVisible: false }
  })
  return true;
}

export const updateLocation = (id, locationData) => async (dispatch, getState) => {

  console.log(id, locationData, 'SEASON DATA')
  const { user } = getState();

  const data = await request(`/api/admin/locations/${id}`, 'PUT', {access_token: user.access_token, data: locationData})

  console.log(data, 'DATA IN UPDATE LOCATION ACTIONS')
  if(!data) return false;


  dispatch({
      type: `locations/${UPDATE_SUCCESS}`,
      payload: data.data
  })
  
  dispatch({
      type: TOGGLE_MODAL,
      modalProps: { isVisible: false }
  })
  
  // if(data.message === 'Season hidden' || data.message === 'Season unhidden'){
  //     // after hiding/unhiding, getSeasons again with filters
  //     return 'getSeasons';
  // }
}



export const deleteLocation = id => async (dispatch, getState) => {

  const { user } = getState();

  const data = await request(`/api/admin/locations/${id}`, 'DELETE', {access_token: user.access_token})

  console.log(data, 'DATA!')

  if(!data) return
  //Close Delete Modal
  // dispatch({
  //     type: TOGGLE_MODAL,
  // })

  //Open Alert Modal
  dispatch({
      type: TOGGLE_MODAL,
      modalProps: {
          isVisible: true,
          title: 'Delete Location',
          message: data.message
      },
      modalType: 'alert'
  })
  // return data
  return dispatch(getLocations());
}
