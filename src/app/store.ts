import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { globalReducer } from "../components/common/viewModel/GlobalSlice";
import { controllPanelReducer } from "../components/controllPanel/viewModel/ControllPanelSlice";
import { metaComponentModelReducer } from "../components/metaComponentModel/viewModel/MetaComponentModelSlice";

export const store = configureStore({
  reducer: {
    metaComponentModel: metaComponentModelReducer,
    controllPannel: controllPanelReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, any>;
