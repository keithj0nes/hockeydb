import { createStore, combineReducers, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";



let reducers = combineReducers({
});

const store = () =>
  createStore(reducers);
export default store;
