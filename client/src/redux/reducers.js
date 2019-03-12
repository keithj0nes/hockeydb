const initialState = {
  user: {},
  isUserLoggedIn: false,

};

export const user = (state = initialState, { type, payload }) => {
  switch (type) {
    case "AUTH_SET_USER":
      return { ...state, user: payload, isUserLoggedIn: !state.isUserLoggedIn }
    default:
      return state;
  }
};
