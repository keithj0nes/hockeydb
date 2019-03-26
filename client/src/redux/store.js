import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
// import { composeWithDevTools } from "redux-devtools-extension";
import { user, season, blogs, misc, players, games } from './reducers';


let reducers = combineReducers({
  user,
  season,
  misc,
  blogs,
  players,
  games
});

const store = createStore(reducers, {}, applyMiddleware(thunk));
export default store;
