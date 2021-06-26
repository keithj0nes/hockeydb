// SEASONS REDUCER!!

import { GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, SET_CURRENT_SEASON, REMOVE_HIDDEN } from '../actionTypes';

const initialSeasonState = {
    isLoading: true,
    seasons: [],
    currentSeason: {},
    seasonTypes: ['Regular', 'Playoffs', 'Tournament'],

    // filter
    isVisible: false,
    // filterOptions: {
    //     show_hidden: true
    // }
    pagination: {
        totalPages: 0,
        currentPage: 1,
        neighbors: 1,
        // limit: 30,  // being determinted on the backend
        onPageChange: () => console.log('changed!'),
    },
};

// FILTER STATE IS BEING MANAGED INSIDE LOCAL COMPONENT

export const seasons = (state = initialSeasonState, { type, payload }) => {
    switch (type) {
    case SET_CURRENT_SEASON:
        return { ...state, currentSeason: payload };
    case `seasons/${GET_INIT}`: // not being used yet
        return { ...state, isLoading: true };

    case 'seasons/stop_loading': // not being used yet
        return { ...state, isLoading: false };

    case `seasons/${GET_SUCCESS}`: {
        let _pagination;
        if (payload.pagination) {
            const { total_pages, page } = payload.pagination;
            _pagination = { pagination: { ...state.pagination, totalPages: total_pages, currentPage: page } };
        }
        return {
            ...state,
            isLoading: false,
            seasons: payload.seasons,
            ..._pagination,
        };
        // return { ...state, isLoading: false, seasons: payload.seasons, pagination: { ...state.pagination, totalPages: payload.total_pages, currentPage: payload.page } };
    }
    case `seasons/${CREATE_SUCCESS}`:
        return { ...state, isLoading: false, seasons: [...state.seasons, payload] };
    case `seasons/${UPDATE_SUCCESS}`: {
        const newSeasons = state.seasons.map(item => {
            if (item.id === payload.id) {
                return payload;
            } if (payload.is_active) {
                return { ...item, is_active: false };
            }
            return item;
        });
        return { ...state, isLoading: false, seasons: newSeasons };
    }
    case `seasons/${REMOVE_HIDDEN}`:
        return { ...state, isLoading: false, seasons: state.seasons.filter(item => item.id !== payload) };
    case 'seasons/FILTER_IS_VISIBLE':
        // if the payload is NOT undefined, use the payload (generally set to false in componentwillunmount)
        // otherwise just set it to the opposite of what it's currently set to
        return { ...state, isVisible: typeof (payload) !== 'undefined' ? payload : !state.isVisible };
    default:
        return state;
    }
};
