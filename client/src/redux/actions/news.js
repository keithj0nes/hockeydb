// import axios from 'axios';
import { request } from './middleware';
import { GET_BLOGS, GET_SUCCESS} from '../actionTypes';



export const sendBlogs = data => ({ type: GET_BLOGS, payload: data })

export const getNews = () => async dispatch => {
  const data = await request('/api/news', 'GET', {}, true)
  console.log(data,'data')
  if (!data.data) return false;
  dispatch(sendBlogs(data.data.news));
  dispatch({
    type: `todaysgames/${GET_SUCCESS}`,
    payload: data.data.todays_games
  })

  return true;
}

export const createNewsPost = (data) => async (dispatch, getState) => {
  const { user } = getState();
  console.log(data, 'data!')
  const post = await request('/api/admin/news', 'POST', { data, access_token: user.user.access_token });
  console.log(post.data, 'POST DOT DATA')
  if (!post.data) return false;
  dispatch(sendBlogs(post.data))
  return true;
}
