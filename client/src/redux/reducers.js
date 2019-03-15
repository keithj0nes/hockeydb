import { AUTH_SET_USER, GET_BLOGS } from './actionTypes';


const initialState = {
  user: {},
  isUserLoggedIn: false,
  blogs: []

};

export const user = (state = initialState, { type, payload }) => {
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
    default:
      return state;
  }
};

