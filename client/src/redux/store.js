import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
// import { composeWithDevTools } from "redux-devtools-extension";
import { user } from './reducers';



let reducers = combineReducers({
  user
});

const store = createStore(reducers, {}, applyMiddleware(thunk));
export default store;
