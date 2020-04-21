import dataStore from "../DataStore";
import DesignTO from "../DesignTO";
import { useIntl } from "react-intl";

export class DesignRepository {
  static find(id: number): DesignTO | undefined {
    return dataStore.getDataStore().designs.get(id);
  }

  static findAll(): DesignTO[] {
    return Array.from(dataStore.getDataStore().designs.values());
  }

  static delete(design: DesignTO): DesignTO {
    let intl = useIntl();
    let success = dataStore.getDataStore().designs.delete(design.id);
    if (!success) {
      throw new Error(
        intl.formatMessage(
          { id: "dataAccess.repository.error.notExists" },
          { objectId: design.id }
        )
      );
    }
    return design;
  }
}
