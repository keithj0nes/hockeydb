import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
// import { composeWithDevTools } from "redux-devtools-extension";
<<<<<<< HEAD
=======

import { user, season, blogs } from './reducers';

>>>>>>> 04f1f2657192a9b90d88a6582a7981c40b6bc260

import { user, season, blogs } from './reducers';

let reducers = combineReducers({
  user,
  blogs,
  season
});

const store = createStore(reducers, {}, applyMiddleware(thunk));
export default store;
