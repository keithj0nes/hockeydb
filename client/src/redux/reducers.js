import { AUTH_SET_USER, SET_SEASON, TOGGLE_NAV_SLIDER, GET_BLOGS, TOGGLE_MODAL, GET_PLAYERS } from './actionTypes';

const initialAuthState = {
  user: {},
  isUserLoggedIn: false,

};


export const user = (state = initialAuthState, { type, payload }) => {
  switch (type) {
    case AUTH_SET_USER:
      return { ...state, user: payload, isUserLoggedIn: !state.isUserLoggedIn }
    default:
      return state;
  }
};


const initialBlogState = {
  blogs: [],
}

export const blogs = (state = initialBlogState, { type, payload }) => {
  switch (type) {
    case GET_BLOGS:
      return { ...state, blogs: payload }
    default:
      return state;
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





const initialMiscState = {
  navSliderVisible: false,
  modalVisible: false,
  modalData: {}
}

export const misc = (state = initialMiscState, { type, payload }) => {
  switch (type) {
    case TOGGLE_NAV_SLIDER:
      return { ...state, navSliderVisible: !state.navSliderVisible }
    case TOGGLE_MODAL:
      return { ...state, modalVisible: !state.modalVisible, modalData: state.modalVisible ? {} : { status: payload.status, message: payload.message } }
    default:
      return state;
  }
}

const initialPlayersState = {
  allPlayers: [],
  selectedPlayer: null,
};

export const players = (state = initialPlayersState, { type, payload }) => {
  switch (type) {
    case GET_PLAYERS:
      return { ...state, allPlayers: payload };
    default:
      return state;
  }
}