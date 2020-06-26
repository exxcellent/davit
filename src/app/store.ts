import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { ComponentReducer } from "../slices/ComponentSlice";
import { DataSetupReducer } from "../slices/DataSetupSlice";
import { DataReducer } from "../slices/DataSlice";
import { EditReducer } from "../slices/EditSlice";
import { globalReducer } from "../slices/GlobalSlice";
import { MasterDataReducer } from "../slices/MasterSlice";
import { SequenceReducer } from "../slices/SequenceSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    sequenceModel: SequenceReducer,
    componentModel: ComponentReducer,
    dataModel: DataReducer,
    dataSetupModel: DataSetupReducer,
    masterData: MasterDataReducer,
    edit: EditReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, any>;
