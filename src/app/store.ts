import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { EditReducer } from "../slices/EditSlice";
import { globalReducer } from "../slices/GlobalSlice";
import { MasterDataReducer } from "../slices/MasterDataSlice";
import { SequenceModelReducer } from "../slices/SequenceModelSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    masterData: MasterDataReducer,
    edit: EditReducer,
    sequenceModel: SequenceModelReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, any>;
