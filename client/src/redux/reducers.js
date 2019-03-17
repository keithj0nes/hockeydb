<<<<<<< HEAD
import { AUTH_SET_USER, GET_BLOGS, SET_SEASON } from './actionTypes';
=======

import { AUTH_SET_USER, SET_SEASON, GET_BLOGS } from './actionTypes';
>>>>>>> 04f1f2657192a9b90d88a6582a7981c40b6bc260

const initialAuthState = {
  user: {},
  isUserLoggedIn: false,
<<<<<<< HEAD
=======
  blogs: []

>>>>>>> 04f1f2657192a9b90d88a6582a7981c40b6bc260
};

const initialBlogState = {
  blogs: []
}

export const user = (state = initialAuthState, { type, payload }) => {
  switch (type) {
    case AUTH_SET_USER:
      return { ...state, user: payload, isUserLoggedIn: !state.isUserLoggedIn }
    default:
      return state;
  }
};

<<<<<<< HEAD
export const blogs = (state = initialBlogState, { type, payload }) => {
  switch (type) {
    case GET_BLOGS:
      return { ...state, blogs: payload }
    default:
      return state;
  }
};

=======
export const blogs = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_BLOGS:
      return { ...state, blogs: payload }
  }
 }
>>>>>>> 04f1f2657192a9b90d88a6582a7981c40b6bc260

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



