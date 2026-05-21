import { configureStore } from "@reduxjs/toolkit";

import { applicationsApi } from "../api/applicationsApi";

export const store = configureStore({
  reducer: {
    [applicationsApi.reducerPath]: applicationsApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(applicationsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
