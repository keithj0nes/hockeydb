import { createSlice } from '@reduxjs/toolkit';
import request from '../request'; // function that sends requests to server, takes object
import { wait } from '../../utils';

const initialState = {
    standings: [],
    isLoading: true,
};

export const standingsSlice = createSlice({
    name: 'standings',
    initialState,
    reducers: {
        getInit: state => {
            // console.log('is loading', state.isLoading);
            state.isLoading = true;
        },
        getStandingSuccess: (state, { payload }) => {
            // console.log('STANDINGS PAYLOAD', payload);

            state.standings = payload;
            state.isLoading = false;
        },
    },
});

export const { getInit, getStandingSuccess } = standingsSlice.actions;

// Pass filter (standings dropdown filter selection)
export const getStandings = (filter = '') => async dispatch => {
    // console.log('getting standings here');
    dispatch(getInit());

    await wait(3000);

    const data = await request({ url: `/api/standings?${filter}`, method: 'GET', session: {}, publicRoute: true });

    // console.log('DATA IN STANDINGS REDUCER', data);

    const standings = data.data.standings.map((item) => ({
        ...item,
        teams_in_division: item.teams_in_division.map((team, idx) => ({ ...team, rank: idx + 1 }))
    }));
    dispatch(getStandingSuccess(standings));
}

export default standingsSlice.reducer;