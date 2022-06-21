import { createSlice } from '@reduxjs/toolkit';
import request from '../request';

const initialState = {
    teams: [],
    isLoading: false,
};

export const teamsSlice = createSlice({
    name: 'teams',
    initialState,
    reducers: {
        getInit: state => {
            if (!state.isLoading) state.isLoading = true;
        },
        getTeamsSuccess: (state, { payload }) => {
            console.log('TEAMS PAYLOAD', payload);
            state.teams = [...payload];
            state.isLoading = false;
        },
    },
});

// activate actions
export const { getInit, getTeamsSuccess } = teamsSlice.actions;

// DB query function
export const getTeamsByDivision = (filter) => async (dispatch) => {
    dispatch(getInit());

    const data = await request({
        url: `/api/teams/by-division?${filter || ''}`,
        method: 'GET',
        session: {},
        isPublic: true,
    });
    // teams categorized by division
    const divisions = data.data.allTeams;
    console.log('TEAMS DATA', divisions);
    dispatch(getTeamsSuccess(divisions));
};


export default teamsSlice.reducer;
