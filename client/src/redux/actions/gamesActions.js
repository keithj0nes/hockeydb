// import axios from 'axios';
import { request } from './middleware';
import { GET_GAMES, NEW_GAME } from '../actionTypes';



export const sendGames = data => ({ type: GET_GAMES, payload: data });
export const sendNewGame = data => ({ type: NEW_GAME, payload: data })

export const getGames = () => async dispatch => {
  const data = await request('/api/games', 'GET', {}, true)
  if (!data) return false;
  dispatch(sendGames(data))
  return true;
}

export const newGame = (home, away, location, date) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/games', 'POST', { data: { home_team: home, away_team: away, location_id: location, start_date: date }, access_token: user.user.access_token })
  if (!post) return false;
  dispatch(sendNewGame(post))
  return true;
}
