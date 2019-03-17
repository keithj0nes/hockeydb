
import { AUTH_SET_USER, SET_SEASON, GET_BLOGS } from './actionTypes';

const initialAuthState = {
  user: {},
  isUserLoggedIn: false,
  blogs: []

};

export const user = (state = initialAuthState, { type, payload }) => {
  switch (type) {
    case AUTH_SET_USER:
      return { ...state, user: payload, isUserLoggedIn: !state.isUserLoggedIn }
    default:
      return state;
  }
};

export const blogs = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_BLOGS:
      return { ...state, blogs: payload }
  }
 }

const initialSeasonState = {
  // season: {}
};

export const season = (state = initialSeasonState, { type, payload }) => {
  switch (type) {
    case SET_SEASON:
      return { ...state, ...payload }
    default:
      return state;
  }
};



