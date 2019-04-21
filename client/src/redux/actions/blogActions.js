// import axios from 'axios';
import { request } from './middleware';
import { GET_BLOGS } from '../actionTypes';



export const sendBlogs = data => ({ type: GET_BLOGS, payload: data })

export const getBlogs = () => async dispatch => {
  const data = await request('/api/blog', 'GET', {}, true)
  if (!data.data) return false;
  dispatch(sendBlogs(data.data))
  return true;
}

export const newBlogPost = (data) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request('/api/admin/blog', 'POST', { data: { message: data }, access_token: user.user.access_token })
  if (!post.data) return false;
  dispatch(sendBlogs(post.data))
  return true;
}
