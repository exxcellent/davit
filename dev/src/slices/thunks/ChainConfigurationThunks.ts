import { ChainConfigurationTO } from "../../dataAccess/access/to/ChainConfigurationTO";
import { ChainStateTO } from "../../dataAccess/access/to/ChainStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions } from "../EditSlice";

const createChainConfigurationThunk = (chainId: number): AppThunk => (dispatch) => {

    const chainConfiguration: ChainConfigurationTO = new ChainConfigurationTO();
    chainConfiguration.chainFk = chainId;

    const chainStates: DataAccessResponse<ChainStateTO[]> = DataAccess.findAllChainStatesByChainFk(chainId);

    if (chainStates.code === 200) {
        chainConfiguration.stateValues = chainStates.object.map(state => {
            return {chainStateFk: state.id, value: state.isState};
        });
    }

    dispatch(editActions.setChainConfiguration(chainConfiguration));
};

const setChainConfigurationThunk = (chainConfiguration: ChainConfigurationTO): AppThunk => (dispatch) => {
    dispatch(editActions.setChainConfiguration(chainConfiguration));
};

export const EditChainConfiguration = {
    update: setChainConfigurationThunk,
    create: createChainConfigurationThunk,
};
