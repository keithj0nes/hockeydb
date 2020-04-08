import { AUTH_SET_USER, TOGGLE_NAV_SLIDER, GET_BLOGS, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL, GET_PLAYERS, GET_GAMES, GET_TEAMS, GET_DIVISIONS, } from './actionTypes';

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


const initialNewsState = {
  news: [],
}

export const news = (state = initialNewsState, { type, payload }) => {
  switch (type) {
    case GET_BLOGS:
      return { ...state, news: payload };
    case `news/${CREATE_SUCCESS}`:
        return  { ...state, news: [payload, ...state.news]};

    // case `news/${UPDATE_SUCCESS}`:
    //     // update item without getting whole list again
    //     const newNews = state.news.map(item => {
    //         if(item.id === payload.id){
    //             return payload
    //         }
    //         return item;

    //       })
    //     return  { ...state, news: newNews }
    default:
      return state;
  }
}

// case `locations/${UPDATE_SUCCESS}`:
//         // update item without getting whole list again
//         const newLocations = state.locations.map(item => {
//             if(item.id === payload.id){
//                 return payload
//             }
//             return item;
//         })
//         return  { ...state, isLoading: false, locations: newLocations }

const initialMiscState = {
  navSliderVisible: false,
  modalVisible: false,
  modalProps: {},
  modalType: '',
  isLoading: false, 
  errors: '',
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
  todaysGames: []
};

export const games = (state = initialGameState, { type, payload }) => {
  switch (type) {
    case GET_GAMES:
      return { ...state, allGames: payload };
    case `todaysgames/${GET_SUCCESS}`:
      return {...state, todaysGames: payload}
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