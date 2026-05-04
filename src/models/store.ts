import { configureStore } from '@reduxjs/toolkit';
import clubReducer from './clubModel';
import appReducer from './applicationModel';
import blogReducer from './dataBlog';
import fitnessReducer from './dataFitness';

export const store = configureStore({
  reducer: {
    clubState: clubReducer,
    appState: appReducer,
    blogState: blogReducer,
    fitnessState: fitnessReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;