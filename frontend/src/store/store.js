import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import groupsReducer from './groups';
import eventsReducer from './events';
import currentEventReducer from './currentEvent';
import currentGroupReducer from './currentGroup';

const rootReducer = combineReducers({
    session: sessionReducer,
    Groups: groupsReducer,
    Events: eventsReducer,
    currentEvent: currentEventReducer,
    currentGroup: currentGroupReducer
});


let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}


const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };


export default configureStore;