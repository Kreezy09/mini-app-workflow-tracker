import { configureStore } from "@reduxjs/toolkit";

import { applicationsApi } from "../api/applicationsApi";

export const createAppStore = () =>
  configureStore({
    reducer: {
      [applicationsApi.reducerPath]: applicationsApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(applicationsApi.middleware)
  });

export const store = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
