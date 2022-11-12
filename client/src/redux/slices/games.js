import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { wait } from '../../utils';

const initialState = {
    isLoading: true,
    allGames: [],
    selectedGame: null,
    scheduleFilters: {
        seasons: [],
        divisions: [],
        teams: [],
        allTeams: [],
    },
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
            console.log('getGamesSuccess Triggered');
            state.allGames = [...payload];
            state.isLoading = false;
            state.scheduleFilters = {
                seasons: { ...games.data.seasons },
                divisions: { ...games.data.divisons },
                teams: { ...teams.data.teams },
            };
            console.log('SCHEDULE FILTERS', state.scheduleFilters);
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

        console.log('GAMES DATA LINE 58', data);
        if (!data.data) return false;

        // deconstruct games data from data
        const { games } = data.data;

        // dispatch to getgamesuccess to add data to state
        dispatch(getGamesSuccess(games));
        console.log('POST GETGAMES DISPATCH');
    };

export default gamesSlice.reducer;

// // Old Version
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
