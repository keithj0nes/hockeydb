// import axios from 'axios';
import { request } from './middleware';
import { GET_BLOGS, GET_SUCCESS, UPDATE_SUCCESS, CREATE_SUCCESS } from '../actionTypes';



export const sendBlogs = data => ({ type: GET_BLOGS, payload: data })

export const getNews = () => async dispatch => {
  const data = await request('/api/news', 'GET', {}, true)
  if (!data.data) return false;
  dispatch(sendBlogs(data.data.news));
  dispatch({
    type: `todaysgames/${GET_SUCCESS}`,
    payload: data.data.todays_games
  })

  return true;
}

export const getNewsPostById = newsPostId => async (dispatch, getState) => {
  // const { user } = getState();
  const post = await request(`/api/news/${newsPostId}`, 'GET', {}, true);
  if(!post.data) return;
  dispatch({
    type: `newsById/${GET_SUCCESS}`,
    payload: post.data
  })

  return true;
}

export const updateNewsPostById = (data, newsPostId) => async (dispatch, getState) => {
  const { user } = getState();
  const post = await request(`/api/admin/news/${newsPostId}`, 'PUT', {data, access_token: user.user.access_token});
  if(!post.data) return;

  console.log(post.data, 'NEWS DATA IN NEWS ACTION AFTER UPDATE')
  dispatch({
    type: `news/${UPDATE_SUCCESS}`,
    payload: post.data
  })

  // dispatch(getNews())


  return true;
}

export const createNewsPost = (data) => async (dispatch, getState) => {
  const { user } = getState();
  console.log(data, 'data!')
  const post = await request('/api/admin/news', 'POST', { data, access_token: user.user.access_token });
  console.log(post.data, 'POST DOT DATA')
  if (!post.data) return false;
  // dispatch(sendBlogs(post.data))
  // dispatch(getNews())
  dispatch({
    type: `news/${CREATE_SUCCESS}`,
    payload: post.data
  })
  return true;
}


export const updateNewsPostOrder = (data, newsPostId) => async (dispatch, getState) => {
  const { user } = getState();

  const post = await request(`/api/admin/news/${newsPostId}`, 'PUT', {data, access_token: user.user.access_token})
  if (!post.data) return false;

  dispatch(getNews())
  // dispatch({
  //   type: `news/${UPDATE_SUCCESS}/order`,
  //   payload: post.data[0]
  // })
  return true;
  
}