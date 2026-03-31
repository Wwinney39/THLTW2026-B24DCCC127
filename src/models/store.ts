import { configureStore } from '@reduxjs/toolkit';
import clubReducer from './clubModel';
import appReducer from './applicationModel';

export const store = configureStore({
  reducer: {
    clubState: clubReducer,
    appState: appReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;