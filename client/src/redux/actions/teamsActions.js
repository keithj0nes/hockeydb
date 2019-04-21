import { request } from './middleware';
import { GET_TEAMS } from '../actionTypes';



export const sendTeams = data => ({ type: GET_TEAMS, payload: data })

export const getTeams = () => async dispatch => {
  const data = await request('/api/teams', 'GET', {}, true)
  if (!data.data) return false;
  dispatch(sendTeams(data.data))
  return true;
}

