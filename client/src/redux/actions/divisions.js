import { request } from './middleware';
import { GET_SUCCESS, TOGGLE_MODAL } from '../actionTypes';


// GET DIVISIONS WORKING 🌟
export const getDivisions = (season_id) => async dispatch => {
  console.log(season_id, 'season ID!')
  const data = await request(`/api/divisions/${season_id}`, 'GET', {}, true)
  console.log(data, 'dataaa')
  if (!data.data) return false;

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


// export const getSeasons = (filter) => async dispatch => {

//   //use filter variable or empty string if null/undefined
//   const data = await request(`/api/seasons?${filter || ''}`, 'GET', {}, true)

//   dispatch({
//       type: `seasons/${GET_SUCCESS}`,
//       payload: data.data
//   })

//   dispatch({
//       type: TOGGLE_MODAL,
//       modalProps: { isVisible: false }
//   })

//   return true;
// }



// CREATE DIVISIONS WORKING 🌟
export const createDivision = (divisionData) => async (dispatch, getState) => {
  // console.log('create didivion before', divisionData);

  //NEED TO ADD SEASON_ID HERE SOMEHWERE!!!!!

  const { user } = getState();
  const data = await request('/api/admin/divisions', 'POST', { data: divisionData, access_token: user.user.access_token })
  // console.log(data, 'DATA IN CREATE DIVISION')
  if (!data) return false;

  dispatch({
    type: TOGGLE_MODAL,
    modalProps: { isVisible: false }
  })

  return dispatch(getDivisions(divisionData.season_id))
}






// UPDATE DIVISIONS NOT WORKING 🚫🛑
export const updateDivision = (id, divisionData) => async (dispatch, getState) => {
  // const { user } = getState();

  console.log(id, divisionData, 'UPDATE DIVISOINS NOT CONNECTED!!!')

  // const data = await request(`/api/admin/seasons/${id}`, 'PUT', {access_token: user.access_token, data: seasonData})

  // console.log(data, 'DATA IN UPDATE SEASON ACTIONS')
  // if(!data) return;

  // //NOT CONNNECTED YET
  // dispatch({
  //     type: UPDATE_SEASON_SUCCESS,
  //     payload: data.data
  // })

  // if(data.data.updateCurrentSeasonGlobally){
  //     console.log('setting globally!')
  //     dispatch({
  //         type: SET_CURRENT_SEASON,
  //         payload: data.data
  //     })
  // }

  // dispatch({
  //     type: TOGGLE_MODAL,
  //     modalProps: { isVisible: false }
  // })
}




// DELETE DIVISIONS NOT WORKING 🚫🛑
export const deleteDivision = id => async (dispatch, getState) => {

  console.log('deleting division - NOT CONNECTED!!')

  // const { user } = getState();

  // const data = await request(`/api/admin/seasons/${id}`, 'DELETE', {access_token: user.access_token})

  // console.log(data, 'DATA!')

  // //Close Delete Modal
  // // dispatch({
  // //     type: TOGGLE_MODAL,
  // // })

  // //Open Alert Modal
  // dispatch({
  //     type: TOGGLE_MODAL,
  //     modalProps: {
  //         isVisible: true,
  //         title: 'Delete Season',
  //         message: data.message
  //     },
  //     modalType: 'alert'
  // })
  // return data
}