import { SequenceConfigurationTO } from "../access/to/SequenceConfigurationTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const SequenceConfigurationRepository = {
    find(sequenceConfigurationFk: number): SequenceConfigurationTO | undefined {
        return dataStore.getDataStore().sequenceConfigurations.get(sequenceConfigurationFk);
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
