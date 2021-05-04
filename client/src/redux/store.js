import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { user, news, misc, players, games, standings, users } from './reducers';
import { seasons } from './reducers/seasons';
import { teams } from './reducers/teams';
import { divisions } from './reducers/divisions';
import { locations } from './reducers/locations';

console.log(process.env.REACT_APP_SITE_LEVEL, 'SITE_LEVEL');

const SITE_LEVEL = process.env.REACT_APP_SITE_LEVEL; // || config.SITE_LEVEL;

const reducers = combineReducers({
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
    // can probably remove site_level from redux state and create a helper function instead
    site_level: (state = SITE_LEVEL) => (state),
});

const store = createStore(reducers, {}, applyMiddleware(thunk));
export default store;
