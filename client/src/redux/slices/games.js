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
            state.allGames = [...payload.data.games];
            state.isLoading = false;
            state.scheduleFilters = {
                seasons: [...payload.data.seasons],
                divisions: [...payload.data.divisions],
                teams: [...payload.data.teams],
            };
            // console.log('GAMES DATA IN SLICE', payload);
            // console.log('UPDATED SEASONS', state.scheduleFilters.seasons);
            // console.log('UPDATED DIVISIONS', state.scheduleFilters.divisions);
            // console.log('UPDATED TEAMS', state.scheduleFilters.teams);
        },
    },
});

export const { getInit, getGamesSuccess, updateScheduleFilters } =
    gamesSlice.actions;

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

        if (!data.data) return false;

        dispatch(getGamesSuccess(data));

        const activeSeason = data.data.seasons.find(
            (season) => season.is_active === true
        );
        return { season: activeSeason.id };
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
