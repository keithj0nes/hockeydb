import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { wait } from '../../utils';

const initialState = {
    isLoading: true,
    allGames: [],
    selectedGame: null,
    gameDetails: null,
    todaysGames: [],
    fromLoadMore: false,
    totalGamesCount: 0,
};

export const gamesSlice = createSlice({
    name: 'games',
    initialState,
    reducers: {
        getInit: (state) => {
            console.log('FETCHING games');
            state.isLoading = true;
        },
        getGamesSuccess: (state, { payload }) => {
            state.allGames = [...payload];
            state.isLoading = false;
            console.log('games STATE', state.allGames);
        },
    },
});

export const { getInit, getGamesSuccess } = gamesSlice.actions;

export const getGames =
    (filter = '') =>
    async (dispatch) => {
        dispatch(getInit());

        const data = await request({
            url: `/api/games?${filter || ''}`,
            method: 'GET',
            session: {},
            isPublic: true,
        });

        console.log('GAMES DATA', data);
        if (!data.data) return false;

        console.log('DIVISONS DATA', data);
        // deconstruct games data from data
        const { games } = data.data;

        // dispatch to getgamesuccess to add data to state
        dispatch(getGamesSuccess(games));
    };

export default gamesSlice.reducer;

// export const getGames2 = (filter) => async (dispatch, getState) => {
//     // if it's from loadmore, dont GET_INIT the whole games data
//     if (filter && !filter.includes('fromLoadMore')) {
//         dispatch({ type: `games/${GET_INIT}` });
//     }

//     const data = await request({
//         url: `/api/games?${filter || ''}`,
//         method: 'GET',
//         session: {},
//         publicRoute: true,
//     });
//     if (!data.data) return false;

//     dispatch({
//         type: 'SCHEDULE_FILTERS',
//         payload: {
//             seasons: data.data.seasons,
//             games: data.data.games,
//             teams: data.data.teams,
//         },
//     });
//     dispatch({
//         type: `games/${GET_SUCCESS}`,
//         payload: {
//             totalGamesCount: data.data.games_count,
//             fromLoadMore: data.data.fromLoadMore,
//             games: data.data.games,
//         },
//     });

//     // this checks the active season to set to the <Schedule /> filter
//     const activeSeason = data.data.seasons.find(
//         (season) => season.is_active === true
//     );
//     return { season: activeSeason.id };
//     // return true;
// };
