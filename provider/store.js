import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import allUsersSlice from "./allUsersSlice";
import allRoomsSlice from "./allRoomsSlice";
import roomSlice from "./roomSlice";
import countSlice from "./countSlice";
import darkSlice from "./darkSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();
    
const rootReducer = combineReducers({
  userSlice,
  allUsersSlice,
  allRoomsSlice,
  roomSlice,
  countSlice,
  darkSlice,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
    version: 0,
  },
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
