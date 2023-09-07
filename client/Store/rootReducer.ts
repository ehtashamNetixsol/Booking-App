import userReducer from "@/Store/UserSlice";
import sliceReducer from "@/Store/counterSlice";
import { combineReducers } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const rootReducer = combineReducers({
  User: persistedReducer,
  counter: sliceReducer,
});
