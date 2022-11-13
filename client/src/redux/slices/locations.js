import { createSlice } from '@reduxjs/toolkit';
import request from '../request'; // function that sends requests to server, takes object
// import { wait } from '../../utils'; // simulates server lag response time

const initialState = {
    isLoading: false,
    isPosting: false,
    locations: [],
    // filter (copied from old project)
    isVisible: false,
};

export const locationsSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {
        getInit: state => {
            console.log('IS LOADING:', state.isLoading);
            state.isLoading = true;
        },
        // reducer takes in state and payload
        // updates state with payload
        getLocationSuccess: (state, { payload }) => {
            console.log('LOCATIONS STATE', state);
            console.log('LOCATIONS PAYLOAD', payload);
            // keep old schedule, add games from schedule
            // state.games = [...state.games, ...payload];
            state.locations = [...payload];
            console.log('STATE.LOCATIONS', state.locations);
            state.isLoading = false;
        },
    },
});

// export reducers in .actions
export const { getInit, getLocationSuccess } = locationsSlice.actions;

export const getLocations = (filter = '') => async (dispatch) => {
    dispatch(getInit());
    console.log(filter, 'filterer')

    // await wait(2000);

    const data = await request({ url: `/api/locations${filter || ''}`, method: 'GET', body: {}, isPublic: true });
    if (!data.data) return false;

    dispatch(getLocationSuccess(data.data));
};


export default locationsSlice.reducer;
