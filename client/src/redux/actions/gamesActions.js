import { request } from './middleware';
import { GET_GAMES } from '../actionTypes';



export const getGames = filter => async (dispatch, getState) => {

  if(!filter){
    const { seasons: { currentSeason } } = getState();
    filter = `season=${currentSeason.name}`
  } 

  console.log(filter, 'filter!')
  const data = await request(`/api/games?${filter || ''}`, 'GET', {}, true)

  console.log(data.data, 'Resopnse in getGames');
  if (!data.data) return false;

  dispatch({ 
    type: 'SCHEDULE_FILTERS', 
    payload: {seasons: data.data.seasons, divisions: data.data.divisions, teams: data.data.teams}
  })
  
  dispatch({ type: GET_GAMES, payload: data.data.games })
  return true;
}

export const newGame = (data) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/games', 'POST', { data, access_token: user.user.access_token })
  if (!post.data) return false;
  return dispatch(getGames())
}
