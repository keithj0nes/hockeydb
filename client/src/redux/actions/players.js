import { request } from './middleware';
import { GET_PLAYERS, GET_SUCCESS } from '../actionTypes';

export const getPlayers = (filter) => async dispatch => {
    // const data = await request('/api/players', 'GET', {}, true);
    const data = await request({ url: `/api/players?${filter || ''}`, method: 'GET', session: {}, publicRoute: true });

    if (!data.data) return false;
    dispatch({ type: GET_PLAYERS, payload: data.data });
    return true;
};

export const getPlayersStats = (filter) => async dispatch => {
    const data = await request({ url: `/api/stats?${filter || ''}`, method: 'GET', session: {}, publicRoute: true });
    if (!data.data) return false;
    dispatch({type: `playerStats/${GET_SUCCESS}`, payload: data.data});
    return true;


}

// export const newBlogPost = (data) => async (dispatch, getState) => {
//   const { user } = getState();
//   const post = await request('/api/admin/blog', 'POST', { data: { message: data }, access_token: user.user.access_token })
//   if (!post) return false;
//   dispatch(sendBlogs(post))
//   return true;
// }
