// import axios from 'axios';
import { request } from './middleware';
import { GET_GAMES } from '../actionTypes';



export const sendGames = data => ({ type: GET_GAMES, payload: data })

export const getGames = () => async dispatch => {
  const data = await request('/api/games', 'GET', {}, true)
  if (!data) return false;
  dispatch(sendGames(data))
  return true;
}

