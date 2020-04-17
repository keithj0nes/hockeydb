import { request } from './middleware';
import { GET_INIT, GET_SUCCESS } from '../actionTypes';

// function timeout(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export const getGames = filter => async (dispatch, getState) => {

  // if it's from loadmore, dont GET_INIT the whole games data
  if(filter && !filter.includes('fromLoadMore')) {
    dispatch({ 
      type: `games/${GET_INIT}`
    })
  }

  // await timeout(2000); // wait 2 seconds

  const data = await request(`/api/games?${filter || ''}`, 'GET', {}, true)
  if (!data.data) return false;

  dispatch({ 
    type: 'SCHEDULE_FILTERS', 
    payload: {seasons: data.data.seasons, divisions: data.data.divisions, teams: data.data.teams}
  })
  
  dispatch({ type: `games/${GET_SUCCESS}`, payload: { totalGamesCount: data.data.games_count, fromLoadMore: data.data.fromLoadMore, games:data.data.games} })
  return true;
}


export const newGame = (data) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/games', 'POST', { data, access_token: user.user.access_token })
  if (!post.data) return false;
  return dispatch(getGames())
}