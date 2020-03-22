import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
// import { composeWithDevTools } from "redux-devtools-extension";
import { user, blogs, misc, players, games } from './reducers';
import { seasons } from './reducers/seasons';
import { teams } from './reducers/teams';
import { divisions } from './reducers/divisions';
import { locations } from './reducers/locations';


let reducers = combineReducers({
  user,
  seasons,
  misc,
  blogs,
  players,
  games,
  locations,
  teams,
  divisions
});

const store = createStore(reducers, {}, applyMiddleware(thunk));
export default store;
