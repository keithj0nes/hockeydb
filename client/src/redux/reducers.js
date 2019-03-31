import { AUTH_SET_USER, SET_CURRENT_SEASON, GET_SEASONS, GET_SEASONS_SUCCESS, TOGGLE_NAV_SLIDER, GET_BLOGS, TOGGLE_MODAL, GET_PLAYERS, GET_GAMES, GET_LOCATIONS, NEW_LOCATION, GET_TEAMS, } from './actionTypes';

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
  isLoading: true,
  seasons: [],
  currentSeason: {}
};

export const seasons = (state = initialSeasonState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_SEASON:
      return { ...state, currentSeason: payload }
    case GET_SEASONS:
      return { ...state, isLoading: true }
    case GET_SEASONS_SUCCESS:
      return { ...state, isLoading: false, seasons: payload }
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

const initialGameState = {
  allGames: [],
  selectedGame: null,
};

export const games = (state = initialGameState, { type, payload }) => {
  switch (type) {
    case GET_GAMES:
      return { ...state, allGames: payload };
    default:
      return state;
  }
}

const initialLocationsState = {
  allLocations: [],
  selectedlocation: null,
};

export const locations = (state = initialLocationsState, { type, payload }) => {
  switch (type) {
    case GET_LOCATIONS:
      return { ...state, allLocations: payload };
    case NEW_LOCATION:
      return { ...state, allLocations: [...state.allLocations, payload] }
    default:
      return state;
  }
}

const initialTeamsState = {
  allTeams: [],
  selectedTeam: null,
};

export const teams = (state = initialTeamsState, { type, payload }) => {
  switch (type) {
    case GET_TEAMS:
      return { ...state, allTeams: payload };
    default:
      return state;
  }
}