import { request } from './middleware';
import { GET_INIT, GET_SUCCESS, TOGGLE_MODAL, CLEAR_STATE } from '../actionTypes';

// Dashboard/DashTeams.js  -  Dashboard/DashGames.js 
export const getTeams = (filter) => async (dispatch, getState) => {
    dispatch({ type: `teams/${GET_INIT}` })
    const { seasons: { currentSeason }  } = getState();

    // use filter variable if empty string or null/undefined
    // revisit this!!!!
    if(!filter){
        filter = `season=${currentSeason.name}`;
    } else {
        if(!filter.includes('season')){
            filter += `&season=${currentSeason.name}`;
        }
    }

    const data = await request(`/api/teams?${filter || ''}`, 'GET', {}, true);
    if (!data.data) return false;

    dispatch({ type: `teams/${GET_SUCCESS}`, payload: data.data.teams });
    dispatch({ type: `divisions/${GET_SUCCESS}`, payload: data.data.divisions });
    dispatch({ type: `seasons/${GET_SUCCESS}`, payload: data.data.seasons });
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
}


// Guest/Teams.js
export const getTeamsByDivision = (filter) => async (dispatch) => {
  const data = await request(`/api/teams/by_division?${filter || ''}`, 'GET', {}, true);
  if (!data.data) return false;

  dispatch({ type: `teams/byDivision/${GET_SUCCESS}`, payload: data.data.allTeams });

  return data.data.season;
}


// Guest/SingleTeam.js
export const getTeamById = (teamId, filter) => async (dispatch, getState) => {
    const team = await request(`/api/teams/${teamId}?${filter || ''}`, 'GET', {}, true)
    if (!team.data) return false;

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
            seasonsSelect: team.data.seasonsSelect,
            standings
        }
    });

    dispatch({ type: `seasons/${GET_SUCCESS}`, payload: team.data.seasons });

    if(!filter) {
        const activeSeason = team.data.seasons.find(season => season.is_active === true)
        return activeSeason.id;
    } else {
        return filter.charAt(filter.length-1);
    }
}


// Dashboard/DashTeams
export const createTeam = teamData => async (dispatch, getState) => {
    const { user } = getState();
    const data = await request(`/api/admin/teams`, 'POST', {access_token: user.user.access_token, data: teamData});
    if(!data) return;

    // dispatch({
    //     type: `teams/${CREATE_SUCCESS}`,
    //     payload: data.data
    // })

    dispatch(getTeams(`season=${teamData.season_name}`));
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
}


// Dashboard/DashTeams
export const updateTeam = (id, teamData) => async (dispatch, getState) => {
    const { user } = getState();
    const data = await request(`/api/admin/teams/${id}`, 'PUT', {access_token: user.user.access_token, data: teamData});
    if(!data) return;

    // dispatch({
    //     type: `teams/${UPDATE_SUCCESS}`,
    //     payload: data.data
    // })

    dispatch(getTeams(`season=${teamData.season_name}`));
    dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
}


// Dashboard/DashTeams
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


// Guest/Teams.js
export const getTeamsPageFilters = (filter) => async (dispatch) => {
    const data = await request(`/api/misc/teams_filters?${filter || ''}`, 'GET', {}, true);
    if(!data.data) return false;
    dispatch({ type: 'SCHEDULE_FILTERS', payload: { seasons: data.data.seasons, allTeams: data.data.all_teams } });
    return true;
}


// Guest/Standings.js
export const getStandingsPageFilters = (filter) => async (dispatch) => {
    const data = await request(`/api/misc/standings_filters?${filter || ''}`, 'GET', {}, true);
    if(!data.data) return false;
    dispatch({ type: 'STANDINGS_FILTERS', payload: { seasons: data.data.seasons, divisions: data.data.divisions } });
    return true;
}


// Guest/STSchedule.js
export const getTeamScheduleById = (teamId, filter) => async (dispatch) => {
  const data = await request(`/api/teams/${teamId}/schedule?${filter || ''}`, 'GET', {}, true);
  if(!data.data) return false;
  dispatch({ type: `teams/singleTeam/${GET_SUCCESS}`, payload: { schedule: data.data } });
  return true;
}


// Guest/SingleTeam.js
export const clearSingleTeamState = () => ({
    type: `teams/singleTeam/${CLEAR_STATE}`
})

// Guest/Standings.js
export const getStandings = (filter) => async (dispatch) => {
    const data = await request(`/api/standings?${filter || ''}`, 'GET', {}, true);
    if (!data.data) return false;
    // heavy lifting - add "rank" key to the teams_in_division list
    // maybe add rank key to the team_season_division table
    const standings = data.data.standings.map((item, ind) => {
        return {...item, teams_in_division: item.teams_in_division.map((team, idx) => {
            return {...team, rank: idx + 1}
        })}
    });

    dispatch({ type: `standings/${GET_SUCCESS}`, payload: standings });
    return data.data.season;
  }