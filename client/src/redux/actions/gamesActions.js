import { request } from './middleware';
import { GET_GAMES, NEW_GAME } from '../actionTypes';



export const getGames = () => async dispatch => {
  const data = await request('/api/games', 'GET', {}, true)
  if (!data) return false;
  return dispatch({ type: GET_GAMES, payload: data })
}

export const newGame = (data) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/games', 'POST', { data, access_token: user.user.access_token })
  if (!post) return false;
  return dispatch(getGames())
}
