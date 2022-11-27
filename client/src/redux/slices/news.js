import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { wait } from '../../utils';

const initialState = {
    news: [],
    isFetching: true,
    todaysGames: [],
};

export const newsSlice = createSlice({
    name: 'news',
    initialState,
    reducers: {
        getInit: (state) => {
            state.isFetching = true;
        },
        getNewsSuccess: (state, { payload }) => {
            console.log(payload, ' payload');
            // state.pagination = payload.pagination;
            state.news = payload.news;
            state.todaysGames = payload.todays_games;
            state.isFetching = false;
        },
    },
});

export const { getInit, getNewsSuccess } = newsSlice.actions;

export const getNews = (filter = '') => async (dispatch) => {
    dispatch(getInit());

    const data = await request({
        url: `/api/news${filter}`,
        method: 'GET',
        isPublic: true,
    });

    console.log(data, 'daattaa');
    dispatch(getNewsSuccess(data.data));
};

export default newsSlice.reducer;
