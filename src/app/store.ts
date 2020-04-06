import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { metaComponentModelReducer } from "../components/MetaComponentModel/ViewModel/MetaComponentModelSlice";

export const store = configureStore({
  reducer: {
    metaComponentModel: metaComponentModelReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
