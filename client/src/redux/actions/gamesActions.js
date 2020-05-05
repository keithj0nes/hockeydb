import { request } from './middleware';
import { GET_INIT, GET_SUCCESS, TOGGLE_MODAL } from '../actionTypes';

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

  // this checks the active season to set to the <Schedule /> filter
  const activeSeason = data.data.seasons.find(season => season.is_active === true)
  return { season: activeSeason.id };
  // return true;
}


export const getGameById = gameId => async (dispatch, getState) => {

  const game = await request(`/api/games/${gameId}`, 'GET', {}, true)

  console.log(game, 'GAMEEEEEE!!')
  if (!game.data) return false;

  dispatch({ 
    type: `gameById/${GET_SUCCESS}`, 
    payload: game.data
  })
  

}


export const newGame = (data) => async (dispatch, getState) => {
  const { user } = getState();
  const newgame = await request('/api/admin/games', 'POST', { data, access_token: user.user.access_token })
  if (!newgame.data) return false;
  
  // console.log(newgame.data, 'data data after new game')

  dispatch({
    type: TOGGLE_MODAL,
    modalProps: { isVisible: false }
  })

  return dispatch(getGames())
}