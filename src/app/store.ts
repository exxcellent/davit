import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { globalReducer } from "../components/common/viewModel/GlobalSlice";
import { controllPanelReducer } from "../components/controllPanel/viewModel/ControllPanelSlice";
import { metaComponentModelReducer } from "../components/metaComponentModel/viewModel/MetaComponentModelSlice";
import { metaDataModelReducer } from "../components/metaDataModel/viewModel/MetaDataModelSlice";
import { ComponentReducer } from "../viewModel/ComponentSlice";
import { DataReducer } from "../viewModel/DataSlice";
import { SequenceReducer } from "../viewModel/SequenceSlice";

export const store = configureStore({
  reducer: {
    metaComponentModel: metaComponentModelReducer,
    metaDataModel: metaDataModelReducer,
    controllPannel: controllPanelReducer,
    global: globalReducer,
    sequenceModel: SequenceReducer,
    componentModel: ComponentReducer,
    dataModel: DataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, any>;
