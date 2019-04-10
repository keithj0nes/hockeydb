import { request } from './middleware';
import { GET_DIVISIONS } from '../actionTypes';



export const getDivisions = () => async dispatch => {
  const data = await request('/api/divisions', 'GET', {}, true)
  if (!data) return false;
  return dispatch({ type: GET_DIVISIONS, payload: data })
}

export const newDivision = (data) => async (dispatch, getState) => {
  console.log('hi my', data);

  const { user } = getState();
  const post = await request('/api/admin/divisions', 'POST', { data: { name: data.newDivisionName }, access_token: user.user.access_token })
  if (!post) return false;
  return dispatch(getDivisions())
}
