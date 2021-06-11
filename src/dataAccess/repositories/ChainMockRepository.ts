import { ChainMockTO } from "../access/to/ChainMockTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ChainMockRepository = {
    findAll(): ChainMockTO[] {
        return Array.from(dataStore.getDataStore().chainMocks.values());
    },

    find(id: number): ChainMockTO | undefined {
        return dataStore.getDataStore().chainMocks.get(id);
    },

    save(chainMock: ChainMockTO): ChainMockTO {
        CheckHelper.nullCheck(chainMock, "SequenceMock");
        let ChainMockTO: ChainMockTO;
        let chainMockId: number = chainMock.id;

        chainMockId = DataAccessUtil.getOrCreateId(chainMockId, this.findAll());

        ChainMockTO = {
            ...chainMock,
            id: chainMockId,
        };

        dataStore.getDataStore().chainMocks.set(chainMockId, ChainMockTO);

        return ChainMockTO;
    },

    delete(chainMock: ChainMockTO): ChainMockTO {
        ConstraintsHelper.deleteChainMockConstraintCheck(chainMock.id, dataStore.getDataStore());

        const success = dataStore.getDataStore().chainMocks.delete(chainMock.id);

        if (!success) {
            throw new Error(`Try to delete chain mock: Chain mock with ID: ${chainMock.id} dos not exists in data store!`);
        }

        return chainMock;
    }
};
