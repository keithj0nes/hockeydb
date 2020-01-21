import { AUTH_SET_USER, TOGGLE_NAV_SLIDER, GET_BLOGS, TOGGLE_MODAL, GET_PLAYERS, GET_GAMES, GET_LOCATIONS, NEW_LOCATION, GET_TEAMS, GET_DIVISIONS, } from './actionTypes';

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






const initialMiscState = {
  navSliderVisible: false,
  modalVisible: false,
  modalProps: {},
  modalType: '',
  isLoading: false, 
  errors: ''
}

export const misc = (state = initialMiscState, { type, modalProps, modalType, isLoading }) => {
  switch (type) {
    case TOGGLE_NAV_SLIDER:
      return { ...state, navSliderVisible: !state.navSliderVisible }
    case TOGGLE_MODAL:
      // console.log(modalProps.errors, 'hitting!!')
      //   console.log(modalProps)
        return { ...state, isLoading, modalVisible: modalProps.isVisible, modalProps: modalProps.isVisible ? modalProps : {}, modalType: modalProps.isVisible ? modalType : '', errors: modalProps.errors}

      // return { ...state, isLoading, modalVisible: !state.modalVisible, modalProps: state.modalVisible ? {} : modalProps, modalType: state.modalType ? '' :  modalType}
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

const initialDivisionsState = {
  allDivisions: [],
  selectedDivision: null,
};

export const divisions = (state = initialDivisionsState, { type, payload }) => {
  switch (type) {
    case GET_DIVISIONS:
      return { ...state, allDivisions: payload };
    default:
      return state;
  }
}