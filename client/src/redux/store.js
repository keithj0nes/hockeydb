import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
// import { composeWithDevTools } from "redux-devtools-extension";
import { user, season, blogs, misc } from './reducers';



let reducers = combineReducers({
  user,
  season,
  misc,
  blogs,
});

const store = createStore(reducers, {}, applyMiddleware(thunk));
export default store;
