// import axios from 'axios';
import { request } from './middleware';
import { GET_BLOGS } from '../actionTypes';



export const sendBlogs = data => ({ type: GET_BLOGS, payload: data })

export const getBlogs = () => async dispatch => {
  const data = await request('/api/blog', 'GET', true)
  if (!data) return false;
  dispatch(sendBlogs(data))
  return true;
}
