import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { wait } from '../../utils';


const initialState = {
    isLoading: true,
    seasons: [],
    currentSeason: {},
    seasonTypes: ['Regular', 'Playoffs', 'Tournament'],

    // filter
    // isVisible: false,
    // // filterOptions: {
    // //     show_hidden: true
    // // }
    // pagination: {
    //     totalPages: 0,
    //     currentPage: 1,
    //     neighbors: 1,
    //     // limit: 30,  // being determinted on the backend
    //     onPageChange: () => console.log('changed!'),
    // },
};


// TODO: connect schedule through new redux tool kit
// TODO: set up loading on table


export const seasonsSlice = createSlice({
    name: 'seasons',
    initialState,
    reducers: {
        getInit: state => {
            state.isLoading = true;
        },
        getSeasonsSuccess: (state, { payload }) => {
            console.log(payload, ' payload');
            state.pagination = payload.pagination;
            state.seasons = payload.seasons;
            state.isLoading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const { getInit, getSeasonsSuccess } = seasonsSlice.actions;

// export default counterSlice.reducer


export const getSeasons = (filter) => async (dispatch) => {
    console.log('getting seasons', filter);
    dispatch(getInit());
    // console.log({ filter });
    // await wait(2000);

    // const data = await request({ url: `/api/games?${filter || ''}`, method: 'GET', session: {}, isPublic: true });
    const data = await request({ url: `/api/seasons${filter || ''}`, method: 'GET', session: {}, isPublic: true });

    console.log(data, 'daattaa');
    // // request();
    dispatch(getSeasonsSuccess(data.data));

    // dispatch({ type: `seasons/${GET_SUCCESS}`, payload: data.data });
};

// export const selectCount = (state) => state.counter.value

export default seasonsSlice.reducer;


// const GAMES_LIST = [
//     { id: 1, home_team: 'calgary', away_team: 'seattle' },
//     { id: 2, home_team: 'tampa bay', away_team: 'new york' },
//     { id: 3, home_team: 'colorado', away_team: 'dallas' },
//     { id: 4, home_team: 'san jose', away_team: 'ottawa' },

// ];
