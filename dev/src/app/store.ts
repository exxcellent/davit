import { configureStore, getDefaultMiddleware, ThunkAction } from "@reduxjs/toolkit";
import { EditReducer } from "../slices/EditSlice";
import { globalReducer } from "../slices/GlobalSlice";
import { MasterDataReducer } from "../slices/MasterDataSlice";
import { SequenceModelReducer } from "../slices/SequenceModelSlice";
import { createStorageListener } from "../utils/StorageListener";
import { storageMiddleware } from "./middlewares/StateSync";

const middleware = getDefaultMiddleware().concat(storageMiddleware);

export const store = configureStore({
    reducer: {
        global: globalReducer,
        masterData: MasterDataReducer,
        edit: EditReducer,
        sequenceModel: SequenceModelReducer,
    },
    middleware,
});

window.addEventListener("storage", createStorageListener(store));

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, any>;
