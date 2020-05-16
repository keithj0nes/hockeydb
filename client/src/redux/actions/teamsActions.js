import { request } from './middleware';
import { GET_SUCCESS, TOGGLE_MODAL } from '../actionTypes';
import { history } from '../../helpers';


export const getTeams = (filter) => async (dispatch, getState) => {
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

  // console.log(filter, 'filter TWOOOOOO')

  const data = await request(`/api/teams?${filter || ''}`, 'GET', {}, true);

  if (!data.data) return false;

  console.log(data.data.teams, 'TEAMS FROM GETTTTT!')

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


export const getTeamById = (teamId, filter) => async (dispatch, getState) => {

  // console.log(filter, 'filter!!')

  const team = await request(`/api/teams/${teamId}?${filter || ''}`, 'GET', {}, true)

  // console.log(team, 'TEAAAAMMM!!')
  if (!team.data) return false;

  // console.log('payload: ', { team:team.data.team, schedule: team.data.schedule})

  dispatch({ 
    type: `teams/singleTeam/${GET_SUCCESS}`, 
    payload: { 
      // ...team.data.team, 
      team: team.data.team,
      schedule: team.data.schedule, 
      recent: team.data.recent,
      record: team.data.record
    }
  })

  dispatch({
    type: `seasons/${GET_SUCCESS}`,
    payload: team.data.seasons
  })


  if(!filter) {
    const activeSeason = team.data.seasons.find(season => season.is_active === true)
    // console.log({season: activeSeason.id})
    // return { season: activeSeason.id };
    return activeSeason.id;
  } else {
    return filter.charAt(filter.length-1);
  }
  

}


export const createTeam = teamData => async (dispatch, getState) => {
  const { user } = getState();

  console.log(teamData, 'teamd')
  const data = await request(`/api/admin/teams`, 'POST', {access_token: user.user.access_token, data: teamData});
  console.log('daatgaa,', data)
  if(!data) return;

  // dispatch({
  //     type: `teams/${CREATE_SUCCESS}`,
  //     payload: data.data
  // })

  dispatch(getTeams(`season=${teamData.season_name}`))

  dispatch({
      type: TOGGLE_MODAL,
      modalProps: { isVisible: false }
  })


}



export const updateTeam = (id, teamData) => async (dispatch, getState) => {
  const { user } = getState();

  console.log(teamData, 'update team')
  const data = await request(`/api/admin/teams/${id}`, 'PUT', {access_token: user.user.access_token, data: teamData});
  console.log('updateteam data response,', data)
  if(!data) return;

  // dispatch({
  //     type: `teams/${CREATE_SUCCESS}`,
  //     payload: data.data
  // })

  dispatch(getTeams(`season=${teamData.season_name}`))

  dispatch({
      type: TOGGLE_MODAL,
      modalProps: { isVisible: false }
  })
}



export const deleteTeam = (id, season) => async (dispatch, getState) => {

  console.log(id, season)
  const { user } = getState();

  const data = await request(`/api/admin/teams/${id}`, 'DELETE', {data: season, access_token: user.user.access_token})

  console.log(data, "DATA AFTER DELETE!!!")
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
  return dispatch(getTeams(season && `season=${season.season_name}`));
}



export const getTeamsPageFilters = (filter) => async (dispatch) => {

  console.log(filter, 'FITLER')

  const data = await request(`/api/misc/teams_filters?${filter || ''}`, 'GET', {}, true);

  console.log(data, 'DATAAAAA ON GET FILTERS')

  dispatch({ 
    type: 'SCHEDULE_FILTERS', 
    payload: { seasons: data.data.seasons, allTeams: data.data.all_teams }
  })
}