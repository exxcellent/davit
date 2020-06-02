import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { globalReducer } from "../components/common/viewModel/GlobalSlice";
import { ComponentReducer } from "../slices/ComponentSlice";
import { DataReducer } from "../slices/DataSlice";
import { SequenceReducer } from "../slices/SequenceSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    sequenceModel: SequenceReducer,
    componentModel: ComponentReducer,
    dataModel: DataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, any>;
