import { SequenceConfigurationTO } from "../access/to/SequenceConfigurationTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const SequenceConfigurationRepository = {
    find(sequenceConfigurationFk: number): SequenceConfigurationTO {
        const sequenceConfiguration: SequenceConfigurationTO | undefined = dataStore.getDataStore().sequenceConfigurations.get(sequenceConfigurationFk);

        if (sequenceConfiguration === undefined) {
            throw new Error("Could not find Sequence Configuration with ID: " + sequenceConfigurationFk);
        } else {
            return sequenceConfiguration;
        }
    },

    findAll(): SequenceConfigurationTO[] {
        return Array.from(dataStore.getDataStore().sequenceConfigurations.values());
    },

    save(dataSetup: SequenceConfigurationTO) {
        CheckHelper.nullCheck(dataSetup, "dataSetup");
        let dataSetupTO: SequenceConfigurationTO;
        if (dataSetup.id === -1) {
            dataSetupTO = {
                ...dataSetup,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            dataSetupTO = {...dataSetup};
        }
        dataStore.getDataStore().sequenceConfigurations.set(dataSetupTO.id!, dataSetupTO);
        return dataSetupTO;
    },

    delete(sequenceConfigurationTO: SequenceConfigurationTO): SequenceConfigurationTO {
        // TODO: add constraint helper.
        const success = dataStore.getDataStore().sequenceConfigurations.delete(sequenceConfigurationTO.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return sequenceConfigurationTO;
    },
};
