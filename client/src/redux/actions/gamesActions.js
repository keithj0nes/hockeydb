import { request } from './middleware';
import { GET_GAMES } from '../actionTypes';



export const getGames = () => async dispatch => {
  const data = await request('/api/games', 'GET', {}, true)
  if (!data.data) return false;
  return dispatch({ type: GET_GAMES, payload: data.data })
}

export const newGame = (data) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/games', 'POST', { data, access_token: user.user.access_token })
  if (!post.data) return false;
  return dispatch(getGames())
}
