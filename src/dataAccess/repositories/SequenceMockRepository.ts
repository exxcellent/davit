import { SequenceMockTO } from "../access/to/SequenceMockTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const SequenceMockRepository = {
    findAll(): SequenceMockTO[] {
        return Array.from(dataStore.getDataStore().sequenceMocks.values());
    },

    find(id: number): SequenceMockTO | undefined {
        return dataStore.getDataStore().sequenceMocks.get(id);
    },

    save(sequenceMock: SequenceMockTO): SequenceMockTO {
        CheckHelper.nullCheck(sequenceMock, "SequenceMock");
        let sequenceMockTOtoSave: SequenceMockTO;
        let sequenceMockId: number = sequenceMock.id;

        sequenceMockId = DataAccessUtil.checkId(sequenceMockId, this.findAll());

        sequenceMockTOtoSave = {
            ...sequenceMock,
            id: sequenceMockId,
        };

        dataStore.getDataStore().sequenceMocks.set(sequenceMockId, sequenceMockTOtoSave);

        return sequenceMockTOtoSave;
    },

    delete(sequenceMock: SequenceMockTO): SequenceMockTO {
        // TODO: add constraint check!

        const success = dataStore.getDataStore().sequenceMocks.delete(sequenceMock.id);

        if (!success) {
            throw new Error(`Try to delete Sequence mock: Sequence mock with ID: ${sequenceMock.id} dos not exists in data store!`);
        }

        return sequenceMock;
    }
};
