import { createSlice } from '@reduxjs/toolkit';
import request from '../request';


const initialState = {
    players: [],
    isLoading: false,
};

export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        getInit: state => {
            console.log('IS LOADING: ', state.isLoading);
            state.isLoading = true;
        },
        getPlayersSuccess: (state, { payload }) => {
            console.log('PLAYER STATE', state);
            console.log('PLAYERS PAYLOAD', payload);
            state.isLoading = false;
            state.players = [...payload];
        },
    },
});

// export actions
export const { getInit, getPlayersSuccess } = playersSlice.actions;

export const getPlayers = (filter) => async (dispatch) => {
    dispatch(getInit());

    const data = await request({
        url: `/api/players?${filter || ''}`,
        method: 'GET',
        session: {},
        isPublic: true,
    });

    const players = data.data;

    dispatch(getPlayersSuccess(players));

    // console.log('PLAYERS DATA.DATA: ', data.data);
};

export default playersSlice.reducer;
