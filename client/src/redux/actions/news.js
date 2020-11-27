// import axios from 'axios';
import { request } from './middleware';
import { GET_BLOGS, GET_SUCCESS, UPDATE_SUCCESS, CREATE_SUCCESS } from '../actionTypes';
import { history } from '../../helpers';

export const getNews = () => async dispatch => {
    // const data = await request('/api/news', 'GET', {}, true);
    const data = await request({ url: '/api/news', method: 'GET', session: {}, publicRoute: true });
    if (!data.data) return false;
    dispatch({ type: GET_BLOGS, payload: data.data.news });
    dispatch({ type: `todaysgames/${GET_SUCCESS}`, payload: data.data.todays_games });
    return true;
};

export const getNewsPostById = id => async (dispatch) => {
    const data = await request({ url: `/api/news/${id}`, method: 'GET', session: {}, publicRoute: true });
    if (!data.data) return false;
    dispatch({ type: `newsById/${GET_SUCCESS}`, payload: data.data });
    return true;
};

export const getNewsTags = () => async (dispatch) => {
    const data = await request({ url: '/api/misc/news_tags', method: 'GET', session: {}, publicRoute: false });
    if (!data.data) return false;
    dispatch({ type: `news/tags/${GET_SUCCESS}`, payload: data.data });
    return true;
};

export const updateNewsPostById = (newsData, id) => async (dispatch) => {
    const data = await request({ url: `/api/admin/news/${id}`, method: 'PUT', session: newsData });
    if (!data.data) return false;
    dispatch({ type: `news/${UPDATE_SUCCESS}`, payload: data.data });
    return true;
};

export const createNewsPost = (newsData) => async (dispatch) => {
    const data = await request({ url: '/api/admin/news', method: 'POST', session: newsData });
    if (!data.data) return false;
    dispatch({ type: `news/${CREATE_SUCCESS}`, payload: data.data });
    history.push('/dashboard/news');
    return true;
};


// double check this -> same URL as 'updateNewPostById'
// maybe rename to /api/admin/news/${id}/order and have
// admin.js in controllers have a sperate function for ordering
export const updateNewsPostOrder = (newsData, id) => async (dispatch) => {
    const data = await request({ url: `/api/admin/news/${id}`, method: 'PUT', session: newsData });

    if (!data.data) return false;

    // change this to update redux instead of getting news again
    dispatch(getNews());
    // dispatch({
    //   type: `news/${UPDATE_SUCCESS}/order`,
    //   payload: post.data[0]
    // })
    return true;
};
