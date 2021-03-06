// teams REDUCER!!

import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, CLEAR_STATE } from '../actionTypes';

const initialteamstate = {
    isLoading: true,
    teams: [],
    singleTeam: {
        record: [],
        team: {},
        seasonsSelect: [],
        schedule: [],
        recent: [],
        standings: [],
        leaders: [],
    },
    teamsByDivision: [],
    // filter
    isVisible: false,
};

export const teams = (state = initialteamstate, { type, payload }) => {
    switch (type) {
    case `teams/${GET_INIT}`:
        return { ...state, isLoading: true };
    case `teams/${GET_SUCCESS}`:
        return { ...state, isLoading: false, teams: payload };
    case `teams/${CREATE_SUCCESS}`:
        return { ...state, isLoading: false, teams: [...state.teams, payload] };
    case `teams/singleTeam/${GET_SUCCESS}`:
        return { ...state, isLoading: false, singleTeam: { ...state.singleTeam, ...payload } };
    case `teams/byDivision/${GET_SUCCESS}`:
        return { ...state, isLoading: false, teamsByDivision: payload };
    case `teams/${UPDATE_SUCCESS}`: {
        const newteams = state.teams.map(item => {
            if (item.id === payload.id) {
                return payload;
            } if (payload.is_active) {
                return { ...item, is_active: false };
            }
            return item;
        });
        return { ...state, isLoading: false, teams: newteams };
    }
    case 'teams/FILTER_IS_VISIBLE':
        // if the payload is NOT undefined, use the payload (generally set to false in componentwillunmount)
        // otherwise just set it to the opposite of what it's currently set to
        return { ...state, isVisible: typeof (payload) !== 'undefined' ? payload : !state.isVisible };
    case `teams/singleTeam/${CLEAR_STATE}`:
        return { ...state, singleTeam: initialteamstate.singleTeam };
    default:
        return state;
    }
};
