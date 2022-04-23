import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { wait } from '../../utils';


// const GAMES_LIST_2 = [
//     { id: 24, home_team: 'st louis', away_team: 'arizona' },
//     { id: 245, home_team: 'florida', away_team: 'seattle' },
//     { id: 46, home_team: 'calgary', away_team: 'edmonton' },
//     { id: 835, home_team: 'anahiem', away_team: 'pittsburgh' },
// ]

const initialState = {
    isLoading: true,
    schedule: [],
    selectedGame: null,
    gameDetails: null,
    todaysGames: [],
    fromLoadMore: false,
    totalGamesCount: 0,
};


// TODO: connect schedule through new redux tool kit
// TODO: set up loading on table


export const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        getInit: state => {
            state.isLoading = true;
        },
        getScheduleSuccess: (state, { payload }) => {
            console.log(payload, ' payload');

            state.schedule = [...state.schedule, ...payload.games];
            state.isLoading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { getInit, getScheduleSuccess } = gamesSlice.actions;

// export default counterSlice.reducer


export const getSchedule = (filter) => async (dispatch) => {
    console.log({ filter });
    await wait(2000);

    const data = await request({ url: `/api/games?${filter || ''}`, method: 'GET', session: {}, publicRoute: true });
    console.log(data, 'daattaa');
    // request();
    dispatch(getScheduleSuccess({ fromLoadMore: true, games: GAMES_LIST }));
};

// export const selectCount = (state) => state.counter.value

export default gamesSlice.reducer;


const GAMES_LIST = [
    { id: 1, home_team: 'calgary', away_team: 'seattle' },
    { id: 2, home_team: 'tampa bay', away_team: 'new york' },
    { id: 3, home_team: 'colorado', away_team: 'dallas' },
    { id: 4, home_team: 'san jose', away_team: 'ottawa' },

];
