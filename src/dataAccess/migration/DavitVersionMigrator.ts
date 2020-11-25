import { StoreTO } from '../access/to/StoreTO';
import { DavitVersionMigrator01 } from './davitVersio01/DavitVersionMigrator01';

export const DavitVersionMigrator = {
    migrate(dataStoreObject: StoreTO): StoreTO {
        let migratedDataStoreObject: StoreTO = {} as StoreTO;
        switch (dataStoreObject.version) {
            case undefined:
                migratedDataStoreObject = DavitVersionMigrator01.migrate(dataStoreObject);
        }
        return migratedDataStoreObject;
    },
};
