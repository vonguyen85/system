import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './userRedux';
import classReducer from './classRedux';
import subjectReducer from './subjectRedux';
import testReducer from './testRedux';
import testingReducer from './testingRedux';
import studentReducer from './studentRedux';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,

  blacklist: ['classReducer']
}

const rootReducer = combineReducers({ user: userReducer, class: classReducer, subject: subjectReducer, test: testReducer, testing: testingReducer, student: studentReducer });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store)