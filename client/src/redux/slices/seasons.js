import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { wait } from '../../utils';

// fetching = getting data
// posting = creating/updatig data

const initialState = {
    isFetching: true,
    isPosting: false,
    seasons: [],
    currentSeason: {},
    seasonTypes: ['Regular', 'Playoffs', 'Tournament'],
    inlineErrors: {},
    seasonById: {},
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
        posting: state => {
            state.isPosting = true;
        },
        clearPosting: state => {
            state.isPosting = false;
        },
        getInit: state => {
            state.isLoading = true;
        },
        getSeasonsSuccess: (state, { payload }) => {
            console.log(payload, ' payload');
            state.pagination = payload.pagination;
            state.seasons = payload.seasons;
            state.isFetching = false;
        },
        getSeasonByIdSuccess: (state, { payload }) => {
            console.log(payload, 'payloaddddd')
            state.seasonById = { ...payload };
        },
        // createSeasonSuccess: (state, { payload }) => {
        // }
        callErrors: (state, { payload }) => {
            console.log(payload, 'payload')
            state.inlineErrors = payload;
        },
        clearErrors: state => {
            state.inlineErrors = {};
        },
    },
});

// Action creators are generated for each case reducer function
export const { clearPosting, posting, getInit, getSeasonsSuccess, getSeasonByIdSuccess, callErrors, clearErrors } = seasonsSlice.actions;

// export default counterSlice.reducer


export const getSeasons = (filter = '') => async (dispatch) => {
    console.log('getting seasons', filter);
    dispatch(getInit());
    // await wait(2000);

    const data = await request({ url: `/api/seasons${filter}`, method: 'GET', isPublic: true });

    console.log(data, 'daattaa');
    dispatch(getSeasonsSuccess(data.data));
};


export const getSeasonById = ({ id, filter = '' }) => async (dispatch) => {
    console.log('getting season by id', id, filter);
    // dispatch(getInit());
    // await wait(2000);

    const data = await request({ url: `/api/seasons/${id}/${filter}`, method: 'GET', isPublic: true });

    console.log(data, 'daattaa');
    dispatch(getSeasonByIdSuccess(data.data));
};


export const createSeason = (seasonData) => async (dispatch, store) => {
    dispatch(posting());
    await wait(1000);
    dispatch(clearPosting());

    // return console.log(seasonData, 'SEASON DATAA')

    const data = await request({ url: '/api/admin/seasons', method: 'POST', body: seasonData, store });
    if (!data) return false;

    if (data.data.errors) {
        dispatch(callErrors(data.data.errors));
        return false;
    }
    // dispatch({ type: `seasons/${CREATE_SUCCESS}`, payload: data.data });
    // dispatch({ type: TOGGLE_MODAL, modalProps: { isVisible: false } });
    return true;
};

// export const selectCount = (state) => state.counter.value

export default seasonsSlice.reducer;


// const GAMES_LIST = [
//     { id: 1, home_team: 'calgary', away_team: 'seattle' },
//     { id: 2, home_team: 'tampa bay', away_team: 'new york' },
//     { id: 3, home_team: 'colorado', away_team: 'dallas' },
//     { id: 4, home_team: 'san jose', away_team: 'ottawa' },

// ];
