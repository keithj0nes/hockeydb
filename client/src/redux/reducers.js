import { AUTH_SET_USER, REMOVE_HIDDEN, TOGGLE_NAV_SLIDER, GET_BLOGS, GET_INIT, GET_SUCCESS, CREATE_SUCCESS, UPDATE_SUCCESS, TOGGLE_MODAL, GET_PLAYERS, GET_TEAMS, GET_DIVISIONS, DELETE_SUCCESS } from './actionTypes';

const initialAuthState = {
    user: {},
    isUserLoggedIn: false,
};

export const user = (state = initialAuthState, { type, payload }) => {
    switch (type) {
    case AUTH_SET_USER:
        return { ...state, user: payload, isUserLoggedIn: !state.isUserLoggedIn };
    default:
        return state;
    }
};


const initialNewsState = {
    news: [],
    newsById: {},
    newsNum: 0,
    newsTags: [],
    isLoading: false,
};

export const news = (state = initialNewsState, { type, payload }) => {
    switch (type) {
    case GET_BLOGS:
        // console.log(payload, 'PAYLOAD')
        return { ...state, news: payload, newsNum: state.newsNum + 1 };
    case `news/${CREATE_SUCCESS}`:
        // console.log(state.newsNum, 'state.newsnum')
        return { ...state, news: [payload, ...state.news], newsNum: state.newsNum + 1 };

    case `news/${UPDATE_SUCCESS}`: {
        // update item without getting whole list again
        const newNews = state.news.map(item => {
            if (item.id === payload.id) {
                return payload;
            }
            return item;
        });
        return { ...state, news: newNews, newsNum: state.newsNum + 1 };
    }
    case `newsById/${GET_SUCCESS}`:
        return { ...state, newsById: payload };
    case `news/tags/${GET_SUCCESS}`:
        return { ...state, newsTags: payload };

    case `news/${DELETE_SUCCESS}`:
    case `news/${REMOVE_HIDDEN}`:
        return { ...state, isLoading: false, news: state.news.filter(item => item.id !== payload.id) };
    default:
        return state;
    }
};


const initialMiscState = {
    navSliderVisible: false,
    modalVisible: false,
    modalProps: {},
    modalType: '',
    isLoading: false,
    errors: '',
    scheduleFilters: {
        seasons: [],
        divisions: [],
        teams: [],
        allTeams: [],
    },
    standingsFilters: {
        seasons: [],
        divisions: [],
    },
};

export const misc = (state = initialMiscState, { type, modalProps, modalType, isLoading, payload }) => {
    switch (type) {
    case TOGGLE_NAV_SLIDER:
        return { ...state, navSliderVisible: !state.navSliderVisible };
    case TOGGLE_MODAL:
        return { ...state, isLoading, modalVisible: modalProps.isVisible, modalProps: modalProps.isVisible ? modalProps : {}, modalType: modalProps.isVisible ? modalType : '', errors: modalProps.errors };
    case 'SCHEDULE_FILTERS':
        return { ...state, scheduleFilters: { ...state.scheduleFilters, ...payload } };
    case 'STANDINGS_FILTERS':
        return { ...state, standingsFilters: { ...state.standingsFilters, ...payload } };
    default:
        return state;
    }
};


const initialStandingsState = {
    standings: [],
};

export const standings = (state = initialStandingsState, { type, payload }) => {
    switch (type) {
    case `standings/${GET_SUCCESS}`:
        return { ...state, standings: payload };
    default:
        return state;
    }
};


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
};

const initialGameState = {
    isLoading: true,
    allGames: [],
    selectedGame: null,
    gameDetails: null,
    todaysGames: [],
    fromLoadMore: false,
    totalGamesCount: 0,
};

export const games = (state = initialGameState, { type, payload }) => {
    switch (type) {
    case `games/${GET_INIT}`:
        return { ...state, isLoading: true };
    case `games/${GET_SUCCESS}`: {
        const { games, fromLoadMore, totalGamesCount } = payload;

        if (fromLoadMore) {
            return { ...state, isLoading: false, totalGamesCount, allGames: [...state.allGames, ...games] };
        }
        return { ...state, isLoading: false, totalGamesCount, allGames: games };
    }
    case `gameById/${GET_SUCCESS}`:
        return { ...state, gameDetails: payload };
    case `todaysgames/${GET_SUCCESS}`:
        return { ...state, todaysGames: payload };
    default:
        return state;
    }
};


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
};

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
};


const initialUsersState = {
    users: [],
    isLoading: true,
};

export const users = (state = initialUsersState, { type, payload }) => {
    switch (type) {
    case `users/${GET_INIT}`:
        return { ...state, isLoading: true };
    case `users/${GET_SUCCESS}`:
        return { ...state, users: payload, isLoading: false };
    default:
        return state;
    }
};
