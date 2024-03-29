import { createSlice } from '@reduxjs/toolkit';
import request from '../request';
import { wait } from '../../utils';

const initialState = {
    divisions: [],
    isLoading: false,
};

export const divisionsSlice = createSlice({
    name: 'divisions',
    initialState,
    reducers: {
        getInit: (state) => {
            console.log('FETCHING DIVISIONS');
            state.isLoading = true;
        },
        getDivisionsSuccess: (state, { payload }) => {
            state.divisions = [...payload];
            state.isLoading = false;
            console.log('DIVISIONS STATE', state.divisions);
        },
    },
});

export const { getInit, getDivisionsSuccess } = divisionsSlice.actions;

export const getDivisions =
    (filter = '') =>
    async (dispatch) => {
        dispatch(getInit());

        const data = await request({
            url: `/api/divisions?${filter}`,
            method: 'GET',
            isPublic: true,
        });

        console.log('DIVISONS DATA', data);
        // deconstruct divisions data from data
        const { divisions } = data.data;

        // dispatch to getdivisionsuccess to add data to state
        dispatch(getDivisionsSuccess(divisions));
    };

export default divisionsSlice.reducer;
