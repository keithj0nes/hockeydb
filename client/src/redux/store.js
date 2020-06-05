import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
// import { composeWithDevTools } from "redux-devtools-extension";
import { user, news, misc, players, games, standings, users } from './reducers';
import { seasons } from './reducers/seasons';
import { teams } from './reducers/teams';
import { divisions } from './reducers/divisions';
import { locations } from './reducers/locations';

let config;
if(process.env.NODE_ENV !== 'production') {
    config = require('../client_config');
}

if(process.env.NODE_ENV === 'production') {
    console.log(process.env.REACT_APP_SITE_LEVEL, 'REACT_APP_SITE_LEVEL')
}

const SITE_LEVEL = process.env.REACT_APP_SITE_LEVEL || config.SITE_LEVEL;

let reducers = combineReducers({
    user,
    seasons,
    misc,
    news,
    players,
    games,
    locations,
    teams,
    divisions,
    standings,
    users,
    site_level: (state = SITE_LEVEL) => (state)
});

const store = createStore(reducers, {}, applyMiddleware(thunk));
export default store;
