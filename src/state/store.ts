import { configureStore } from "@reduxjs/toolkit";
import passengerReducer from "./passenger";
import commonSettingReducer from "./commonSetting";
import userReducer from "./user";
import listener, { loadFromLocalStorage } from "./listener";

export const store = configureStore({
  reducer: {
    passenger: passengerReducer,
    commonSetting: commonSettingReducer,
    user: userReducer,
  },
  preloadedState: loadFromLocalStorage(),
});
store.subscribe(listener);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
