import { SequenceConfigurationTO } from "../../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "../../dataAccess/access/to/SequenceStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const createSequenceConfigurationThunk = (sequenceId: number): AppThunk => (dispatch) => {
    const sequenceConfigurationTO: SequenceConfigurationTO = new SequenceConfigurationTO();

    sequenceConfigurationTO.sequenceFk = sequenceId;

    const sequenceStates: DataAccessResponse<SequenceStateTO[]> = DataAccess.findAllSequenceStatesBySequenceFk(sequenceId);

    if (sequenceStates.code === 200) {
        sequenceConfigurationTO.stateValues = sequenceStates.object.map(state => {
            return {sequenceStateFk: state.id, value: state.isState};
        });
    }

    //TODO: To be enabled as soon we can save and load configurations.
    // const response: DataAccessResponse<SequenceConfigurationTO> = DataAccess.saveSequenceConfigurationTO(sequenceConfigurationTO);
    //
    // if (response.code !== 200) {
    //     dispatch(GlobalActions.handleError(response.message));
    // }
    // dispatch(MasterDataActions.loadSequenceConfigurationsFromBackend());
    // dispatch(setSequenceConfigurationThunk(response.object));

    dispatch(setSequenceConfigurationThunk(sequenceConfigurationTO));
};

const saveSequenceConfigurationThunk = (sequenceConfigurationTO: SequenceConfigurationTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceConfigurationTO> = DataAccess.saveSequenceConfigurationTO(sequenceConfigurationTO);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequenceConfigurationsFromBackend());
};

const deleteSequenceConfigurationThunk = (sequenceConfigurationTO: SequenceConfigurationTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceConfigurationTO> = DataAccess.deleteSequenceConfiguration(sequenceConfigurationTO);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequenceConfigurationsFromBackend());
};

const setSequenceConfigurationThunk = (sequenceConfiguration: SequenceConfigurationTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode === Mode.EDIT_CONFIGURATION) {
        dispatch(editActions.setSequenceConfigurationToEdit(sequenceConfiguration));
    } else {
        dispatch(GlobalActions.handleError("Try to set Sequence Configuration to edit in mode: " + mode));
    }
};

export const EditSequenceConfiguration = {
    save: saveSequenceConfigurationThunk,
    delete: deleteSequenceConfigurationThunk,
    update: setSequenceConfigurationThunk,
    create: createSequenceConfigurationThunk,
};
