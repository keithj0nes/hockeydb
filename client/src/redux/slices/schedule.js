import { createSlice } from '@reduxjs/toolkit';
import request from '../request'; // function that sends requests to server, takes object
import { wait } from '../../utils'; // simulates server lag response time

// set initial state
const initialState = {
    games: [],
    isLoading: true,
};

// set/export reducers in object with name and initial state
export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        getInit: state => {
            console.log('IS LOADING:', state.isLoading);
            state.isLoading = true;
        },
        // reducer takes in state and payload
        // updates state with payload
        getScheduleSuccess: (state, { payload }) => {
            console.log('SCHEDULE STATE', state);
            console.log('SCHEDULE PAYLOAD', payload);
            // keep old schedule, add games from schedule
            // state.games = [...state.games, ...payload];
            state.games = [...payload];
            console.log('STATE.GAMES', state.games);
            state.isLoading = false;
        },
    },
});

// export reducers in .actions
export const { getInit, getScheduleSuccess } = scheduleSlice.actions;

// function currying?
export const getSchedule = (filter) => async (dispatch) => {

    await wait(2000);

    const data = await request({
        url: `/api/games?${filter || ''}`,
        method: 'GET',
        session: {},
        publicRoute: true,
    });
    console.log('DATA', data);
    console.log('DATA.DATA.GAMES', data.data.games);
    // get games from data
    const games = data.data.games;

    dispatch(getScheduleSuccess(games));
};
// set/export function to dispatch queries to db with current state

// export reducers object with .reducer
export default scheduleSlice.reducer;

// test data
// const GAMES_LIST = [
//     { id: 1, home_team: 'calgary', away_team: 'seattle' },
//     { id: 2, home_team: 'tampa bay', away_team: 'new york' },
//     { id: 3, home_team: 'colorado', away_team: 'dallas' },
//     { id: 4, home_team: 'san jose', away_team: 'ottawa' },

// ];