import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../app/store';
import { Arrow, ArrowType } from '../components/common/fragments/svg/DavitPath';
import { ActorCTO } from '../dataAccess/access/cto/ActorCTO';
import { ChainCTO } from '../dataAccess/access/cto/ChainCTO';
import { DataCTO } from '../dataAccess/access/cto/DataCTO';
import { DataSetupCTO } from '../dataAccess/access/cto/DataSetupCTO';
import { GeometricalDataCTO } from '../dataAccess/access/cto/GeometraicalDataCTO';
import { SequenceCTO } from '../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../dataAccess/access/to/ActionTO';
import { ChainDecisionTO } from '../dataAccess/access/to/ChainDecisionTO';
import { ChainlinkTO } from '../dataAccess/access/to/ChainlinkTO';
import { ChainTO } from '../dataAccess/access/to/ChainTO';
import { DataInstanceTO } from '../dataAccess/access/to/DataInstanceTO';
import { DataRelationTO } from '../dataAccess/access/to/DataRelationTO';
import { DecisionTO } from '../dataAccess/access/to/DecisionTO';
import { GroupTO } from '../dataAccess/access/to/GroupTO';
import { InitDataTO } from '../dataAccess/access/to/InitDataTO';
import { SequenceTO } from '../dataAccess/access/to/SequenceTO';
import { ActionType } from '../dataAccess/access/types/ActionType';
import { GoToTypesChain } from '../dataAccess/access/types/GoToTypeChain';
import { DataAccess } from '../dataAccess/DataAccess';
import { DataAccessResponse } from '../dataAccess/DataAccessResponse';
import { DavitUtil } from '../utils/DavitUtil';
import { handleError } from './GlobalSlice';
import { MasterDataActions, masterDataSelectors } from './MasterDataSlice';
import { SequenceModelActions } from './SequenceModelSlice';
import { EditActor } from './thunks/ActorThunks';
import { EditDataSetup } from './thunks/DataSetupThunks';
import { EditData } from './thunks/DataThunks';
import { EditDecision } from './thunks/DecisionThunks';
import { EditGroup } from './thunks/GroupThunks';
import { EditInitData } from './thunks/InitDataThunks';
import { EditRelation } from './thunks/RelationThunks';
import { EditSequence } from './thunks/SequenceThunks';
import { EditStep } from './thunks/StepThunks';

export enum Mode {
    TAB = 'TAB',
    FILE = 'FILE',
    VIEW = 'VIEW',
    EDIT = 'EDIT',
    EDIT_ACTOR = 'EDIT_ACTOR',
    EDIT_GROUP = 'EDIT_GROUP',
    EDIT_DATA = 'EDIT_DATA',
    EDIT_DATA_INSTANCE = 'EDIT_DATA_INSTANCE',
    EDIT_RELATION = 'EDIT_RELATION',
    EDIT_DATASETUP = 'EDIT_DATASETUP',
    EDIT_DATASETUP_INITDATA = 'EDIT_DATASETUP_INIT DATA',
    EDIT_CHAIN = 'EDIT_CHAIN',
    EDIT_CHAIN_DECISION = 'EDIT_CHAIN_DECISION',
    EDIT_CHAIN_DECISION_CONDITION = 'EDIT_CHAIN_DECISION_CONDITION',
    EDIT_CHAIN_LINK = 'EDIT_CHAIN_LINK',
    EDIT_SEQUENCE = 'EDIT_SEQUENCE',
    EDIT_SEQUENCE_DECISION = 'EDIT_SEQUENCE_DECISION',
    EDIT_SEQUENCE_DECISION_CONDITION = 'EDIT_SEQUENCE_DECISION_CONDITION',
    EDIT_SEQUENCE_STEP = 'EDIT_SEQUENCE_STEP',
    EDIT_SEQUENCE_STEP_ACTION = 'EDIT_SEQUENCE_STEP_ACTION',
}

const MODE_LOCAL_STORAGE = 'MODE';

export interface StepAction {
    step: SequenceStepCTO;
    actionTO: ActionTO;
}

export interface EmptyObjectToEdit {}

interface EditState {
    mode: Mode;
    objectToEdit:
        | ActorCTO
        | DataCTO
        | DataRelationTO
        | SequenceTO
        | SequenceStepCTO
        | StepAction
        | DataSetupCTO
        | InitDataTO
        | GroupTO
        | DecisionTO
        | ChainlinkTO
        | ChainDecisionTO
        | ActionTO
        | EmptyObjectToEdit;
    instanceId: number;
}
const getInitialState: EditState = {
    objectToEdit: {} as EmptyObjectToEdit,
    mode: Mode.EDIT,
    instanceId: -1,
};

const EditSlice = createSlice({
    name: 'edit',
    initialState: getInitialState,
    reducers: {
        setChainLinkToEdit: (state, action: PayloadAction<ChainlinkTO>) => {
            if (state.mode === Mode.EDIT_CHAIN_LINK) {
                state.objectToEdit = action.payload;
            } else {
                console.warn('Try to set chain step to edit in mode: ' + state.mode);
            }
        },
        setInstanceId: (state, action: PayloadAction<number>) => {
            state.instanceId = action.payload;
        },
        setChainDecisionToEdit: (state, action: PayloadAction<ChainDecisionTO>) => {
            if (state.mode === Mode.EDIT_CHAIN_DECISION || state.mode === Mode.EDIT_CHAIN_DECISION_CONDITION) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set chain step to edit in mode: ' + state.mode);
            }
        },
        setActorToEdit: (state, action: PayloadAction<ActorCTO>) => {
            if (state.mode === Mode.EDIT_ACTOR) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set actor to edit in mode: ' + state.mode);
            }
        },
        setDataToEdit: (state, action: PayloadAction<DataCTO>) => {
            if (state.mode === Mode.EDIT_DATA || state.mode === Mode.EDIT_DATA_INSTANCE) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set data to edit in mode: ' + state.mode);
            }
        },
        setInstanceToEdit: (state, action: PayloadAction<DataInstanceTO>) => {
            if (state.mode === Mode.EDIT_DATA_INSTANCE) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set data to edit in mode: ' + state.mode);
            }
        },
        setRelationToEdit: (state, action: PayloadAction<DataRelationTO>) => {
            if (state.mode === Mode.EDIT_RELATION) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set relation to edit in mode: ' + state.mode);
            }
        },
        setSequenceToEdit: (state, action: PayloadAction<SequenceTO>) => {
            if (state.mode === Mode.EDIT_SEQUENCE) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set sequence to edit in mode: ' + state.mode);
            }
        },
        setStepToEdit: (state, action: PayloadAction<SequenceStepCTO>) => {
            if (state.mode.startsWith(Mode.EDIT_SEQUENCE_STEP)) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set step to edit in mode: ' + state.mode);
            }
        },
        setActionToEdit: (state, action: PayloadAction<ActionTO>) => {
            if (state.mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set action to edit in mode: ' + state.mode);
            }
        },
        setDataSetupToEdit: (state, action: PayloadAction<DataSetupCTO>) => {
            if (state.mode === Mode.EDIT_DATASETUP) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set dataSetup to edit in mode: ' + state.mode);
            }
        },
        setInitDataToEdit: (state, action: PayloadAction<InitDataTO>) => {
            if (state.mode === Mode.EDIT_DATASETUP_INITDATA) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set initData to edit in mode: ' + state.mode);
            }
        },
        setGroupToEdit: (state, action: PayloadAction<GroupTO>) => {
            if (state.mode === Mode.EDIT_GROUP) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set group to edit in mode: ' + state.mode);
            }
        },
        setDecisionToEdit: (state, action: PayloadAction<DecisionTO>) => {
            if (state.mode === Mode.EDIT_SEQUENCE_DECISION || Mode.EDIT_SEQUENCE_DECISION_CONDITION) {
                state.objectToEdit = action.payload;
            } else {
                handleError('Try to set decision to edit in mode: ' + state.mode);
            }
        },
        clearObjectToEdit: (state) => {
            state.objectToEdit = {} as EmptyObjectToEdit;
        },
        setMode: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload;
        },
    },
});

export const editActions = EditSlice.actions;

// =============================================== THUNKS ===============================================

// ----------------------------------------------- SET MODE -----------------------------------------------
const setModeWithStorage = (mode: Mode): AppThunk => (dispatch, getstate) => {
    if (mode !== getstate().edit.mode) {
        localStorage.setItem(MODE_LOCAL_STORAGE, mode);
        dispatch(EditSlice.actions.setMode(mode));
    }
};

const setModeToFile = (): AppThunk => (dispatch) => {
    dispatch(EditSlice.actions.clearObjectToEdit());
    dispatch(setModeWithStorage(Mode.FILE));
};

const setModeToTab = (): AppThunk => (dispatch) => {
    dispatch(EditSlice.actions.clearObjectToEdit());
    dispatch(setModeWithStorage(Mode.TAB));
};

const setModeToView = (): AppThunk => (dispatch) => {
    dispatch(EditSlice.actions.clearObjectToEdit());
    dispatch(setModeWithStorage(Mode.VIEW));
    dispatch(SequenceModelActions.calcChain());
};

const setModeToEdit = (): AppThunk => (dispatch, getState) => {
    dispatch(EditSlice.actions.clearObjectToEdit());
    if (getState().edit.mode !== Mode.VIEW) {
        dispatch(setModeWithStorage(Mode.EDIT));
    } else {
        const stepIndex: number | null = getState().sequenceModel.currentStepIndex;
        if (stepIndex !== null && stepIndex > 0) {
            const step:
                | SequenceStepCTO
                | undefined = getState().sequenceModel.selectedSequenceModel?.sequenceStepCTOs.find(
                (step) => step.squenceStepTO.id === stepIndex,
            );
            if (step) {
                dispatch(setModeToEditStep(step));
            } else {
                dispatch(setModeWithStorage(Mode.EDIT));
            }
        } else {
            dispatch(setModeWithStorage(Mode.EDIT));
        }
    }
};

const setModeToEditActor = (actor?: ActorCTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_ACTOR));
    if (actor === undefined) {
        dispatch(EditActor.create());
    } else {
        dispatch(EditSlice.actions.setActorToEdit(actor));
    }
};

const setModeToEditActorById = (id: number): AppThunk => (dispatch, getState) => {
    const actor: ActorCTO | undefined = getState().masterData.actors.find((act) => act.actor.id === id);
    if (actor) {
        dispatch(setModeWithStorage(Mode.EDIT_ACTOR));
        dispatch(EditSlice.actions.setActorToEdit(actor));
    }
};
const setModeToEditDataById = (id: number): AppThunk => (dispatch, getState) => {
    const data: DataCTO | undefined = getState().masterData.datas.find((data) => data.data.id === id);
    if (data) {
        dispatch(setModeWithStorage(Mode.EDIT_DATA));
        dispatch(EditSlice.actions.setDataToEdit(data));
    }
};

const editDataInstanceById = (id: number): AppThunk => (dispatch, getState) => {
    if ((getState().edit.objectToEdit as DataCTO).data) {
        dispatch(setModeWithStorage(Mode.EDIT_DATA_INSTANCE));
        dispatch(EditSlice.actions.setInstanceId(id));
    } else {
        dispatch(setModeWithStorage(Mode.EDIT));
    }
};

const setModeToEditData = (data?: DataCTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_DATA));
    if (data === undefined) {
        dispatch(EditData.create());
    } else {
        dispatch(EditSlice.actions.setDataToEdit(data));
    }
};

const setModeToEditDataInstance = (id?: number): AppThunk => (dispatch, getState) => {
    if ((getState().edit.objectToEdit as DataCTO).data) {
        if (id === undefined) {
            id = -1;
            const copyData: DataCTO = DavitUtil.deepCopy(getState().edit.objectToEdit as DataCTO);
            const newInstance: DataInstanceTO = new DataInstanceTO();
            copyData.data.instances.push(newInstance);
            dispatch(EditSlice.actions.setDataToEdit(copyData));
        }
        dispatch(EditSlice.actions.setInstanceId(id));
        dispatch(setModeWithStorage(Mode.EDIT_DATA_INSTANCE));
    }
};

const setModeToEditRelation = (relation?: DataRelationTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_RELATION));
    if (relation === undefined) {
        dispatch(EditRelation.create());
    } else {
        dispatch(EditSlice.actions.setRelationToEdit(relation));
    }
};

const setModeToEditSequence = (sequenceId?: number): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
    if (sequenceId) {
        // TODO: change CTO to TO.
        const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
        if (response.code === 200) {
            dispatch(EditSlice.actions.setSequenceToEdit(DavitUtil.deepCopy(response.object.sequenceTO)));
            dispatch(SequenceModelActions.setCurrentSequence(sequenceId));
        } else {
            handleError(response.message);
        }
    } else {
        dispatch(EditSequence.create());
    }
};

const setModeToEditChain = (chain?: ChainTO): AppThunk => (dispatch) => {
    if (!chain) {
        dispatch(EditActions.chain.create());
    } else {
        dispatch(SequenceModelActions.setCurrentChain(chain));
    }
    dispatch(setModeWithStorage(Mode.EDIT_CHAIN));
};

const setModeToEditChainlink = (
    chainlink: ChainlinkTO,
    from?: ChainlinkTO | ChainDecisionTO,
    ifGoTo?: boolean,
): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_CHAIN_LINK));
    dispatch(EditActions.chainLink.create(chainlink, from, ifGoTo));
};

const setModeEditChainDecision = (
    chainDecision: ChainDecisionTO,
    from?: ChainDecisionTO | ChainlinkTO,
    ifGoTO?: boolean,
): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_CHAIN_DECISION));
    dispatch(EditActions.chainDecision.create(chainDecision, from, ifGoTO));
};

const setModeToEditChainCondition = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
    if (decision !== null && decision !== undefined) {
        dispatch(setModeWithStorage(Mode.EDIT_CHAIN_DECISION_CONDITION));
    } else {
        handleError("Edit Condition: 'Decision is null or undefined'.");
    }
};

const setModeToEditStep = (
    stepCTO: SequenceStepCTO,
    from?: SequenceStepCTO | DecisionTO,
    ifGoTo?: boolean,
): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP));
    dispatch(EditStep.create(stepCTO, from, ifGoTo));
};

const setModeToEditAction = (action: ActionTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP_ACTION));
    dispatch(EditSlice.actions.setActionToEdit(action));
};

const setModeToEditGroup = (group?: GroupTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_GROUP));
    if (group === undefined) {
        dispatch(EditGroup.create());
    } else {
        dispatch(EditSlice.actions.setGroupToEdit(group));
    }
};

const setModeToEditInitData = (initData: InitDataTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_DATASETUP_INITDATA));
    if (initData.id !== -1) {
        const response: DataAccessResponse<InitDataTO> = DataAccess.findInitData(initData.id);
        if (response.code === 200) {
            dispatch(EditSlice.actions.setInitDataToEdit(DavitUtil.deepCopy(response.object)));
        } else {
            handleError(response.message);
        }
    } else {
        dispatch(EditInitData.save(initData));
    }
};

const setModeToEditDataSetup = (id?: number): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_DATASETUP));
    if (id) {
        const response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(id);
        if (response.code === 200) {
            dispatch(EditSlice.actions.setDataSetupToEdit(DavitUtil.deepCopy(response.object)));
        } else {
            handleError(response.message);
        }
    } else {
        dispatch(EditDataSetup.create());
    }
};

const setModeToEditDecision = (
    decision: DecisionTO,
    from?: SequenceStepCTO | DecisionTO,
    ifGoTo?: Boolean,
): AppThunk => (dispatch) => {
    dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_DECISION));
    dispatch(EditDecision.create(decision, from, ifGoTo));
};

const setModeToEditCondition = (decision: DecisionTO): AppThunk => (dispatch) => {
    if (decision !== null && decision !== undefined) {
        dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_DECISION_CONDITION));
        // dispatch(EditSlice.actions.setDecisionToEdit(decision));
    } else {
        handleError("Edit Condition: 'Decision is null or undefined'.");
    }
};

// ----------------------------------------------- CHAIN -----------------------------------------------

const createChainThunk = (): AppThunk => (dispatch) => {
    const chain: ChainTO = new ChainTO();
    const response: DataAccessResponse<ChainTO> = DataAccess.saveChainTO(chain);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(SequenceModelActions.setCurrentChain(response.object));
};

const getChainCTO = (chain: ChainTO): ChainCTO => {
    const response: DataAccessResponse<ChainCTO> = DataAccess.getChainCTO(chain);
    if (response.code !== 200) {
        console.warn(response.message);
    }
    console.info(response.object);
    return response.object;
};

const saveChainThunk = (chain: ChainTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainTO> = DataAccess.saveChainTO(chain);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(SequenceModelActions.setCurrentChain(response.object));
};

const deleteChainThunk = (chain: ChainTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceTO> = DataAccess.deleteChain(chain);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
    dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const createChainLinkThunk = (link: ChainlinkTO, from?: ChainlinkTO | ChainDecisionTO, ifGoTO?: boolean): AppThunk => (
    dispatch,
) => {
    const response: DataAccessResponse<ChainlinkTO> = DataAccess.saveChainlink(link);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    } else {
        if (from !== undefined) {
            if ((from as ChainlinkTO).dataSetupFk !== undefined) {
                (from as ChainlinkTO).goto = { type: GoToTypesChain.LINK, id: response.object.id };
                dispatch(EditActions.chainLink.save(from as ChainlinkTO));
            }
            if ((from as ChainDecisionTO).ifGoTo !== undefined) {
                if (ifGoTO) {
                    (from as ChainDecisionTO).ifGoTo = { type: GoToTypesChain.LINK, id: response.object.id };
                } else {
                    (from as ChainDecisionTO).elseGoTo = { type: GoToTypesChain.LINK, id: response.object.id };
                }
                dispatch(EditActions.chainDecision.save(from as ChainDecisionTO));
            }
        }
        dispatch(EditSlice.actions.setChainLinkToEdit(response.object));
    }
};

const saveChainLinkThunk = (step: ChainlinkTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainlinkTO> = DataAccess.saveChainlink(step);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const deleteChainLinkThunk = (step: ChainlinkTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainlinkTO> = DataAccess.deleteChainLink(step);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const createChainDecisionThunk = (
    decision: ChainDecisionTO,
    from?: ChainDecisionTO | ChainlinkTO,
    ifGoTO?: boolean,
): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.saveChaindecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    } else {
        if (from !== undefined) {
            if ((from as ChainlinkTO).dataSetupFk !== undefined) {
                (from as ChainlinkTO).goto = { type: GoToTypesChain.DEC, id: response.object.id };
                dispatch(EditActions.chainLink.save(from as ChainlinkTO));
            }
            if ((from as ChainDecisionTO).elseGoTo !== undefined) {
                if (ifGoTO) {
                    (from as ChainDecisionTO).ifGoTo = { type: GoToTypesChain.DEC, id: response.object.id };
                } else {
                    (from as ChainDecisionTO).elseGoTo = { type: GoToTypesChain.DEC, id: response.object.id };
                }
                dispatch(EditActions.chainDecision.save(from as ChainDecisionTO));
            }
        }
        dispatch(EditSlice.actions.setChainDecisionToEdit(response.object));
    }
};

const saveChainDecisionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.saveChaindecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const deleteChainDecisionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.deleteChaindecision(decision);
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const setChainRootThunk = (chainId: number, rootId: number, isDecision: boolean): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainlinkTO | ChainDecisionTO> = DataAccess.setChainRoot(
        chainId,
        rootId,
        isDecision,
    );
    if (response.code !== 200) {
        dispatch(handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(MasterDataActions.loadChainLinksFromBackend());
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const findChainDecisionThunk = (id: number): ChainDecisionTO => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.findChainDecision(id);
    if (response.code !== 200) {
        handleError(response.message);
    }
    return response.object;
};

const findChainLinkThunk = (id: number): ChainlinkTO => {
    const response: DataAccessResponse<ChainlinkTO> = DataAccess.findChainLink(id);
    if (response.code !== 200) {
        handleError(response.message);
    }
    return response.object;
};

// TODO: this method is copied from sequencemodelslice! remove one and mage the other reachable in both slices
const getArrowsForStepFk = (sequenceStepCTO: SequenceStepCTO, rootState: RootState): Arrow[] => {
    let arrows: Arrow[] = [];
    arrows = mapActionsToArrows(sequenceStepCTO.actions, rootState);
    return arrows;
};

// TODO: this method is copied from sequencemodelslice! remove one and mage the other reachable in both slices
const mapActionsToArrows = (actions: ActionTO[], state: RootState): Arrow[] => {
    const arrows: Arrow[] = [];

    actions.forEach((action) => {
        const sourceGeometricalData: GeometricalDataCTO | undefined = state.masterData.actors.find(
            (comp) => comp.actor.id === action.sendingActorFk,
        )?.geometricalData;

        const targetGeometricalData: GeometricalDataCTO | undefined = state.masterData.actors.find(
            (comp) => comp.actor.id === action.receivingActorFk,
        )?.geometricalData;

        const dataLabels: string[] = [];
        if (action.actionType === ActionType.TRIGGER) {
            dataLabels.push(action.triggerText);
        } else {
            const dataLabel: string | undefined = state.masterData.datas.find((data) => data.data.id === action.dataFk)
                ?.data.name;
            if (dataLabel) {
                dataLabels.push(dataLabel);
            }
        }

        const type: ArrowType = action.actionType.includes('SEND') ? ArrowType.SEND : ArrowType.TRIGGER;

        if (sourceGeometricalData && targetGeometricalData) {
            const existingArrow: Arrow | undefined = arrows.find(
                (arrow) =>
                    arrow.sourceGeometricalData.geometricalData.id === sourceGeometricalData.geometricalData.id &&
                    arrow.targetGeometricalData.geometricalData.id === targetGeometricalData.geometricalData.id,
            );

            if (existingArrow) {
                existingArrow.dataLabels.push(...dataLabels);
            } else {
                arrows.push({
                    sourceGeometricalData,
                    targetGeometricalData,
                    dataLabels,
                    type,
                });
            }
        }
    });
    return arrows;
};

// =============================================== SELECTORS ===============================================
export const EditReducer = EditSlice.reducer;
/**
 * To make it easy to select the right obejct to edit we have selectors that ensure that the right object to edit is returned for the mode
 * Since the object to edit is a sumtype we ensure the right type by checking for a unqiue field
 */
export const editSelectors = {
    mode: (state: RootState): Mode => state.edit.mode,
    actorToEdit: (state: RootState): ActorCTO | null => {
        return state.edit.mode === Mode.EDIT_ACTOR && (state.edit.objectToEdit as ActorCTO).actor
            ? (state.edit.objectToEdit as ActorCTO)
            : null;
    },
    chainLinkToEdit: (state: RootState): ChainlinkTO | null => {
        return state.edit.mode === Mode.EDIT_CHAIN_LINK && (state.edit.objectToEdit as ChainlinkTO).dataSetupFk
            ? (state.edit.objectToEdit as ChainlinkTO)
            : null;
    },
    chainDecisionToEdit: (state: RootState): ChainDecisionTO | null => {
        return state.edit.mode === Mode.EDIT_CHAIN_DECISION ||
            (state.edit.mode === Mode.EDIT_CHAIN_DECISION_CONDITION &&
                (state.edit.objectToEdit as ChainDecisionTO).elseGoTo)
            ? (state.edit.objectToEdit as ChainDecisionTO)
            : null;
    },
    dataToEdit: (state: RootState): DataCTO | null => {
        return state.edit.mode === Mode.EDIT_DATA ||
            (Mode.EDIT_DATA_INSTANCE && (state.edit.objectToEdit as DataCTO).data)
            ? (state.edit.objectToEdit as DataCTO)
            : null;
    },
    groupToEdit: (state: RootState): GroupTO | null => {
        return state.edit.mode === Mode.EDIT_GROUP && (state.edit.objectToEdit as GroupTO).color
            ? (state.edit.objectToEdit as GroupTO)
            : null;
    },
    relationToEdit: (state: RootState): DataRelationTO | null => {
        return state.edit.mode === Mode.EDIT_RELATION && (state.edit.objectToEdit as DataRelationTO).direction1
            ? (state.edit.objectToEdit as DataRelationTO)
            : null;
    },
    sequenceToEdit: (state: RootState): SequenceTO | null => {
        return state.edit.mode === Mode.EDIT_SEQUENCE && (state.edit.objectToEdit as SequenceTO)
            ? (state.edit.objectToEdit as SequenceTO)
            : null;
    },
    editActionArrow: (state: RootState): Arrow | null => {
        if (
            state.edit.mode === Mode.EDIT_SEQUENCE_STEP_ACTION &&
            (state.edit.objectToEdit as ActionTO).receivingActorFk
        ) {
            const actionToEdit: ActionTO = state.edit.objectToEdit as ActionTO;

            const sourceComp: ActorCTO | undefined = state.masterData.actors.find(
                (comp) => comp.actor.id === actionToEdit.sendingActorFk,
            );

            const targetComp: ActorCTO | undefined = state.masterData.actors.find(
                (comp) => comp.actor.id === actionToEdit.receivingActorFk,
            );

            const dataLabel: string =
                actionToEdit.actionType === ActionType.TRIGGER
                    ? actionToEdit.triggerText
                    : masterDataSelectors.getDataCTOById(actionToEdit.dataFk)(state)?.data.name ||
                      'Could not find data';

            const type: ArrowType = actionToEdit.actionType.includes('SEND') ? ArrowType.SEND : ArrowType.TRIGGER;

            if (sourceComp && targetComp) {
                return {
                    sourceGeometricalData: sourceComp.geometricalData,
                    targetGeometricalData: targetComp.geometricalData,
                    dataLabels: [dataLabel],
                    type: type,
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    editStepArrows: (state: RootState): Arrow[] => {
        let arrows: Arrow[] = [];

        if (state.edit.mode === Mode.EDIT_SEQUENCE_STEP && (state.edit.objectToEdit as SequenceStepCTO).squenceStepTO) {
            arrows = getArrowsForStepFk(state.edit.objectToEdit as SequenceStepCTO, state);
        }
        return arrows;
    },
    dataSetupToEdit: (state: RootState): DataSetupCTO | null => {
        return state.edit.mode === Mode.EDIT_DATASETUP && (state.edit.objectToEdit as DataSetupCTO).dataSetup
            ? (state.edit.objectToEdit as DataSetupCTO)
            : null;
    },
    initDataToEdit: (state: RootState): InitDataTO | null => {
        return state.edit.mode === Mode.EDIT_DATASETUP_INITDATA && (state.edit.objectToEdit as InitDataTO).dataSetupFk
            ? (state.edit.objectToEdit as InitDataTO)
            : null;
    },
    stepToEdit: (state: RootState): SequenceStepCTO | null => {
        switch (state.edit.mode) {
            case Mode.EDIT_SEQUENCE_STEP:
                return (state.edit.objectToEdit as SequenceStepCTO).squenceStepTO
                    ? (state.edit.objectToEdit as SequenceStepCTO)
                    : null;
            case Mode.EDIT_SEQUENCE_STEP_ACTION:
                return (state.edit.objectToEdit as StepAction).step
                    ? (state.edit.objectToEdit as StepAction).step
                    : null;
            default:
                return null;
        }
    },
    actionToEdit: (state: RootState): ActionTO | null => {
        return state.edit.mode === Mode.EDIT_SEQUENCE_STEP_ACTION && (state.edit.objectToEdit as ActionTO).actionType
            ? (state.edit.objectToEdit as ActionTO)
            : null;
    },
    decisionToEdit: (state: RootState): DecisionTO | null => {
        return (state.edit.mode === Mode.EDIT_SEQUENCE_DECISION || Mode.EDIT_SEQUENCE_DECISION_CONDITION) &&
            (state.edit.objectToEdit as DecisionTO).elseGoTo
            ? (state.edit.objectToEdit as DecisionTO)
            : null;
    },
    instanceIdToEdit: (state: RootState): number => {
        return state.edit.instanceId;
    },
};

// =============================================== ACTIONS ===============================================

export const EditActions = {
    setMode: {
        editActor: setModeToEditActor,
        editActorById: setModeToEditActorById,
        editData: setModeToEditData,
        editDataById: setModeToEditDataById,
        editDataInstance: setModeToEditDataInstance,
        editInstaceById: editDataInstanceById,
        editGroup: setModeToEditGroup,
        editRelation: setModeToEditRelation,
        editSequence: setModeToEditSequence,
        editDataSetup: setModeToEditDataSetup,
        editInitData: setModeToEditInitData,
        editStep: setModeToEditStep,
        editDecision: setModeToEditDecision,
        editCondition: setModeToEditCondition,
        editAction: setModeToEditAction,
        editChain: setModeToEditChain,
        editChainLink: setModeToEditChainlink,
        editChainDecision: setModeEditChainDecision,
        editChainCondition: setModeToEditChainCondition,
        edit: setModeToEdit,
        view: setModeToView,
        file: setModeToFile,
        tab: setModeToTab,
    },

    chain: {
        create: createChainThunk,
        save: saveChainThunk,
        delete: deleteChainThunk,
        setRoot: setChainRootThunk,
        getCTO: getChainCTO,
    },
    chainLink: {
        create: createChainLinkThunk,
        save: saveChainLinkThunk,
        delete: deleteChainLinkThunk,
        find: findChainLinkThunk,
    },
    chainDecision: {
        create: createChainDecisionThunk,
        save: saveChainDecisionThunk,
        delete: deleteChainDecisionThunk,
        find: findChainDecisionThunk,
    },
};
