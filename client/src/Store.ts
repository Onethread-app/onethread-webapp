import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from 'stores/IndexReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// const initialState = {} as any;

const persistConfig = {
  key: 'projectType',
  storage,
  whitelist: ['projectReducer'], // which reducer want to store
};

const pReducer = persistReducer(persistConfig, rootReducer);
const middleware = [thunk];

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  pReducer,
  composeEnhancers(applyMiddleware(...middleware)),
);
const persistor = persistStore(store);

export { persistor, store };
