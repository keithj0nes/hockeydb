import { request } from './middleware';
import { GET_PLAYERS } from '../actionTypes';

export const getPlayers = () => async dispatch => {
    console.log('in players action');
    const data = await request('/api/players', 'GET', {}, true);
    if (!data.data) return false;
    dispatch({ type: GET_PLAYERS, payload: data.data });
    return true;
}

// export const newBlogPost = (data) => async (dispatch, getState) => {
//   const { user } = getState();
//   const post = await request('/api/admin/blog', 'POST', { data: { message: data }, access_token: user.user.access_token })
//   if (!post) return false;
//   dispatch(sendBlogs(post))
//   return true;
// }
