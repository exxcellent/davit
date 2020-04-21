import dataStore from "../DataStore";
import PositionTO from "../PositionTO";
import { useIntl } from "react-intl";

export class PositionRepository {
  static find(id: number): PositionTO | undefined {
    return dataStore.getDataStore().positions.get(id);
  }

  static findAll(): PositionTO[] {
    return Array.from(dataStore.getDataStore().positions.values());
  }

  static delete(position: PositionTO): boolean {
    const intl = useIntl();
    let success = dataStore.getDataStore().positions.delete(position.id);
    if (!success) {
      throw new Error(
        intl.formatMessage(
          { id: "dataAccess.repository.error.notExists" },
          { objectId: position.id }
        )
      );
    }
    return success;
  }
}
