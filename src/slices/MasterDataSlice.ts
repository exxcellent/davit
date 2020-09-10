import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { ChainDecisionTO } from "../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../dataAccess/access/to/ChainTO";
import { DataRelationTO } from "../dataAccess/access/to/DataRelationTO";
import { DataSetupTO } from "../dataAccess/access/to/DataSetupTO";
import { GroupTO } from "../dataAccess/access/to/GroupTO";
import { SequenceTO } from "../dataAccess/access/to/SequenceTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { handleError } from "./GlobalSlice";

interface MasterDataState {
  components: ComponentCTO[];
  groups: GroupTO[];
  datas: DataCTO[];
  relations: DataRelationTO[];
  sequences: SequenceTO[];
  dataSetups: DataSetupTO[];
  chains: ChainTO[];
  chainLinks: ChainlinkTO[];
  chainDecisions: ChainDecisionTO[];
}
const getInitialState: MasterDataState = {
  components: [],
  groups: [],
  datas: [],
  relations: [],
  sequences: [],
  dataSetups: [],
  chains: [],
  chainLinks: [],
  chainDecisions: [],
};

const MasterDataSlice = createSlice({
  name: "masterData",
  initialState: getInitialState,
  reducers: {
    setComponents: (state, action: PayloadAction<ComponentCTO[]>) => {
      state.components = action.payload;
    },
    setGroups: (state, action: PayloadAction<GroupTO[]>) => {
      state.groups = action.payload;
    },
    setDatas: (state, action: PayloadAction<DataCTO[]>) => {
      state.datas = action.payload;
    },
    setRelations: (state, action: PayloadAction<DataRelationTO[]>) => {
      state.relations = action.payload;
    },
    setSequences: (state, action: PayloadAction<SequenceTO[]>) => {
      state.sequences = action.payload;
    },
    setDataSetups: (state, action: PayloadAction<DataSetupTO[]>) => {
      state.dataSetups = action.payload;
    },
    setChains: (state, action: PayloadAction<ChainTO[]>) => {
      state.chains = action.payload;
    },
    setChainLinks: (state, action: PayloadAction<ChainlinkTO[]>) => {
      state.chainLinks = action.payload;
    },
    setChainDecisions: (state, action: PayloadAction<ChainDecisionTO[]>) => {
      state.chainDecisions = action.payload;
    },
  },
});

// =============================================== THUNKS ===============================================

const loadGroupsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO[]> = await DataAccess.findAllGroups();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setGroups(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadComponentsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO[]> = await DataAccess.findAllComponents();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setComponents(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadDatasFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO[]> = await DataAccess.findAllDatas();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setDatas(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadRelationsFromBackend = (): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationTO[]> = await DataAccess.findAllDataRelations();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setRelations(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadSequencesFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceTO[]> = DataAccess.findAllSequences();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setSequences(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadDataSetupsFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupTO[]> = DataAccess.findAllDataSetups();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setDataSetups(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadChainsFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainTO[]> = DataAccess.findAllChains();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setChains(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadChainLinksFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainlinkTO[]> = DataAccess.findAllChainLinks();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setChainLinks(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadChainDecisionsFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainDecisionTO[]> = DataAccess.findAllChainDecisions();
  if (response.code === 200) {
    dispatch(MasterDataSlice.actions.setChainDecisions(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadAll = (): AppThunk => (dispatch) => {
  dispatch(loadGroupsFromBackend());
  dispatch(loadComponentsFromBackend());
  dispatch(loadDataSetupsFromBackend());
  dispatch(loadRelationsFromBackend());
  dispatch(loadSequencesFromBackend());
  dispatch(loadDatasFromBackend());
  dispatch(loadChainsFromBackend());
  dispatch(loadChainLinksFromBackend());
  dispatch(loadChainDecisionsFromBackend());
};

// ----------------------------------------------- SEARCH --------------------------------------------------

// =============================================== SELECTORS ===============================================

export const MasterDataReducer = MasterDataSlice.reducer;
export const masterDataSelectors = {
  components: (state: RootState): ComponentCTO[] => state.masterData.components,
  groups: (state: RootState): GroupTO[] => state.masterData.groups,
  datas: (state: RootState): DataCTO[] => state.masterData.datas,
  relations: (state: RootState): DataRelationTO[] => state.masterData.relations,
  sequences: (state: RootState): SequenceTO[] => state.masterData.sequences,
  chains: (state: RootState): ChainTO[] => state.masterData.chains,
  chainLinks: (state: RootState): ChainlinkTO[] => state.masterData.chainLinks,
  chainDecisions: (state: RootState): ChainDecisionTO[] => state.masterData.chainDecisions,
  dataSetup: (state: RootState): DataSetupTO[] => state.masterData.dataSetups,
  getSequenceTO: (id: number) => (state: RootState): SequenceTO | undefined => {
    return state.masterData.sequences.find((sequence) => sequence.id === id);
  },
  getComponentById: (id: number) => {
    return (state: RootState): ComponentCTO | null => {
      return state.masterData.components.find((comp) => comp.component.id === id) || null;
    };
  },
  getDataSetupToById: (id: number) => {
    return (state: RootState): DataSetupTO | null => {
      return state.masterData.dataSetups.find((dataSetup) => dataSetup.id === id) || null;
    };
  },
  isFirstChainElement: (id: number) => {
    return (state: RootState): boolean => {
      let isFirst: boolean = true;
      if (state.masterData.chainLinks.some((link) => link.chainFk === id)) {
        isFirst = false;
      }
      if (state.masterData.chainDecisions.some((dec) => dec.chainFk === id)) {
        isFirst = false;
      }
      return isFirst;
    };
  },
};

// =============================================== ACTIONS ===============================================

export const MasterDataActions = {
  loadChainsFromBackend,
  loadChainLinksFromBackend,
  loadChainDecisionsFromBackend,
  loadGroupsFromBackend,
  loadComponentsFromBackend,
  loadDataSetupsFromBackend,
  loadRelationsFromBackend,
  loadSequencesFromBackend,
  loadDatasFromBackend,
  loadAll,
};
