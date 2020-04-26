import { request } from './middleware';
import { GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL } from '../actionTypes';
// import qs from 'query-string';


export const getDivisions = (filter) => async (dispatch, getState) => {
  // if(!filter){
  //   const { seasons: { currentSeason } } = getState();
  //   filter = `season=${currentSeason.name}`
  // } 

  const { seasons: { currentSeason }  } = getState();

  console.log(filter, 'filter!')
  //use filter variable if empty string or null/undefined

  if(!filter){
      filter = `season=${currentSeason.name}`;
  } else {
    if(!filter.includes('season')){
      filter += `&season=${currentSeason.name}`;
    }
  }

  //use filter variable or empty string if null/undefined
  const data = await request(`/api/divisions?${filter || ''}`, 'GET', {}, true)

  if (!data) return false;

  dispatch({
      type: `divisions/${GET_SUCCESS}`,
      payload: data.data.divisions
  })

  dispatch({
    type: `seasons/${GET_SUCCESS}`,
    payload: data.data.seasons
  })

  dispatch({
      type: TOGGLE_MODAL,
      modalProps: { isVisible: false }
  })

  return true;
}


export const createDivision = (divisionData) => async (dispatch, getState) => {
  const { user } = getState();
  const data = await request('/api/admin/divisions', 'POST', { data: divisionData, access_token: user.user.access_token })
  if (!data) return false;


  dispatch({
      type: `divisions/${CREATE_SUCCESS}`,
      payload: data.data
  })

  dispatch({
    type: TOGGLE_MODAL,
    modalProps: { isVisible: false }
  })
}


export const updateDivision = (id, divisionData) => async (dispatch, getState) => {
  const { user } = getState();

  const data = await request(`/api/admin/divisions/${id}`, 'PUT', {access_token: user.user.access_token, data: divisionData})

  console.log(data, 'DATA IN UPDATE SEASON ACTIONS')
  if(!data) return false;

  //NOT CONNNECTED YET
  dispatch({
      type: `divisions/${UPDATE_SUCCESS}`,
      payload: data.data
  })


  dispatch({
      type: TOGGLE_MODAL,
      modalProps: { isVisible: false }
  })

  if(data.message === 'Division hidden' || data.message === 'Division unhidden'){
    // after hiding/unhiding, getDivisions again with filters
    return 'getDivisions';
}
}


export const deleteDivision = (id, season) => async (dispatch, getState) => {

  const { user } = getState();

  const data = await request(`/api/admin/divisions/${id}`, 'DELETE', {access_token: user.user.access_token})

  if(!data) return false;

  //Close Delete Modal
  // dispatch({
  //     type: TOGGLE_MODAL,
  // })

  //Open Alert Modal
  dispatch({
      type: TOGGLE_MODAL,
      modalProps: {
          isVisible: true,
          title: 'Delete Division',
          message: data.message
      },
      modalType: 'alert'
  })
  return dispatch(getDivisions(season && `season=${season}`));
}