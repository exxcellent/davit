import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { ComponentReducer } from "../slices/ComponentSlice";
import { DataSetupReducer } from "../slices/DataSetupSlice";
import { DataReducer } from "../slices/DataSlice";
import { globalReducer } from "../slices/GlobalSlice";
import { SequenceReducer } from "../slices/SequenceSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    sequenceModel: SequenceReducer,
    componentModel: ComponentReducer,
    dataModel: DataReducer,
    dataSetupModel: DataSetupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, any>;
