import { request } from './middleware';
import { GET_TEAMS, GET_SUCCESS, TOGGLE_MODAL, CREATE_SUCCESS } from '../actionTypes';



export const sendTeams = data => ({ type: GET_TEAMS, payload: data })

export const getTeams = (filter) => async (dispatch, getState) => {
  const { seasons: { currentSeason }  } = getState();

  //use filter variable or empty string if null/undefined

  // filter = 'division_id=1';
  const data = await request(`/api/teams?${filter || ''}`, 'GET', {}, true);
  // const divisions = await request(`/api/divisions/${currentSeason.id}`, 'GET', {}, true);

  console.log(data, 'DATA IN TEAMSACITON!!!')
  // console.log(divisions, 'divison')
  if (!data.data) return false;
  dispatch({
      type: `teams/${GET_SUCCESS}`,
      payload: data.data
  })
  // if(!divisions) return;
  // dispatch({
  //   type: `divisions/${GET_SUCCESS}`,
  //   payload: divisions.data.divisions
  // })

  dispatch({
      type: TOGGLE_MODAL,
      modalProps: { isVisible: false }
  })
  return true;
}

export const createTeam = teamData => async (dispatch, getState) => {
  const { user } = getState();

  console.log(teamData, 'teamd')
  const data = await request(`/api/admin/teams`, 'POST', {access_token: user.access_token, data: teamData});
  console.log('daatgaa,', data)
  if(!data) return;

  dispatch({
      type: `teams/${CREATE_SUCCESS}`,
      payload: data.data
  })


  dispatch({
      type: TOGGLE_MODAL,
      modalProps: { isVisible: false }
  })


}