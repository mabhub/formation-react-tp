import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'

import {loggerMadeByHand} from '../middlewares/loggerMadeByHand';
import { nominatimMiddleware } from '../middlewares/nominatim';
import nominatim from './nominatim/reducers';
import overpass from './overpass/reducers';
import { loadNominatimResults } from './nominatim/actions';

let enhancerArray = [
  applyMiddleware(thunk, logger, loggerMadeByHand, nominatimMiddleware)
];

if (process.env.NODE_ENV !== 'production') {
  enhancerArray.push(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
}

const enhancer = compose(...enhancerArray);
const store = createStore(
  combineReducers({
    nominatim,
    overpass
  }),
  enhancer
);

window.store = store;

store.dispatch(loadNominatimResults());

export default store;
