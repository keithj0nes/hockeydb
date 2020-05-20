import { request } from './middleware';
import { GET_SUCCESS, TOGGLE_MODAL, CLEAR_STATE } from '../actionTypes';


export const getTeams = (filter) => async (dispatch, getState) => {
    const { seasons: { currentSeason }  } = getState();

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

export const getTeamsByDivision = (filter) => async (dispatch, getState) => {

  const data = await request(`/api/teams/by_division?${filter || ''}`, 'GET', {}, true);

  if (!data.data) return false;

  dispatch({
      type: `teams/byDivision/${GET_SUCCESS}`,
      payload: data.data.allTeams
  })

  return data.data.season;
}




export const getTeamById = (teamId, filter) => async (dispatch, getState) => {

    const team = await request(`/api/teams/${teamId}?${filter || ''}`, 'GET', {}, true)

    if (!team.data) return false;

    console.log(team.data, 'GET TEAM BY ID DATA')

    // add rank key - not stored in db
    const standings = team.data.standings.map((item, ind) => {
        return {...item, rank: ind + 1}
    })

    dispatch({ 
        type: `teams/singleTeam/${GET_SUCCESS}`, 
        payload: { 
            // ...team.data.team, 
            team: team.data.team,
            // schedule: team.data.schedule, 
            recent: team.data.recent,
            record: team.data.record,
            standings
        }
    })

    dispatch({
        type: `seasons/${GET_SUCCESS}`,
        payload: team.data.seasons
    })


    if(!filter) {
        console.log(team.data.seasons)
        const activeSeason = team.data.seasons.find(season => season.is_active === true)
        console.log(activeSeason, 'activeseason')
        // console.log({season: activeSeason.id})
        // return { season: activeSeason.id };
        return activeSeason.id;
    } else {
        return filter.charAt(filter.length-1);
    }
  

}


export const createTeam = teamData => async (dispatch, getState) => {
    const { user } = getState();

    const data = await request(`/api/admin/teams`, 'POST', {access_token: user.user.access_token, data: teamData});
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

    const data = await request(`/api/admin/teams/${id}`, 'PUT', {access_token: user.user.access_token, data: teamData});
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

    const { user } = getState();
    const data = await request(`/api/admin/teams/${id}`, 'DELETE', {data: season, access_token: user.user.access_token})
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

    const data = await request(`/api/misc/teams_filters?${filter || ''}`, 'GET', {}, true);

    dispatch({ 
        type: 'SCHEDULE_FILTERS', 
        payload: { seasons: data.data.seasons, allTeams: data.data.all_teams }
    })
}

export const getTeamScheduleById = (teamId, filter) => async (dispatch) => {

  const data = await request(`/api/teams/${teamId}/schedule?${filter || ''}`, 'GET', {}, true);

  dispatch({ 
      type: `teams/singleTeam/${GET_SUCCESS}`, 
      payload: { 
          schedule: data.data 
      }
  })
}



export const clearSingleTeamState = () => {
    return {
        type: `teams/singleTeam/${CLEAR_STATE}`
    }
}