import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { rootReducer } from 'stores/IndexReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootSaga from 'stores/indexSagas';

import createSagaMiddleware from 'redux-saga';
// const initialState = {} as any;

const persistConfig = {
  key: 'projectType',
  storage,
  whitelist: [
    'projectReducer',
    'subscriptionReducer',
    'taskIndexReducer',
    'timeTrackerReducer',
  ], // which reducer want to store
};

const sagaMiddleware = createSagaMiddleware();

const pReducer = persistReducer(persistConfig, rootReducer);
const middleware = [thunk, sagaMiddleware];

// const composeEnhancers =
//   (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(...middleware)),
);
sagaMiddleware.run(rootSaga);
const persistor = persistStore(store);

export { persistor, store };
