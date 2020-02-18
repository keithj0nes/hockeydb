import { request } from './middleware';
import { GET_SUCCESS, TOGGLE_MODAL, CREATE_SUCCESS } from '../actionTypes';




export const getTeams = (filter) => async (dispatch, getState) => {
  const { seasons: { currentSeason }  } = getState();

  // console.log(filter, 'filter!')
  //use filter variable if empty string or null/undefined

  if(!filter){
      filter = `season=${currentSeason.name}`;
  } else {
    if(!filter.includes('season')){
      filter += `&season=${currentSeason.name}`;
    }
  }

  // console.log(filter, 'filter TWOOOOOO')

  const data = await request(`/api/teams?${filter || ''}`, 'GET', {}, true);

  if (!data.data) return false;

  dispatch({
      type: `teams/${GET_SUCCESS}`,
      payload: data.data.teams
  })

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