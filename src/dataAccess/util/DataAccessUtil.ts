import { AbstractTO } from "../access/to/AbstractTO";

export const DataAccessUtil = {
    determineNewId(abstractTOs: AbstractTO[]): number {
        let id = Math.max(...abstractTOs.map((abstract) => abstract.id)) + 1;
        if (id === -Infinity) {
            id = 1;
        }
        return id;
    },

    /**
     * Generates a new UUID if id is -1.
     * @param id
     * @param abstracktTOs
     *
     * @return UUID
     */
    checkId(id: number, abstracktTOs: AbstractTO[]): number {
        let idToCheck: number = id;

        if (idToCheck === -1) {
            idToCheck = this.determineNewId(abstracktTOs);
        }

        return idToCheck;
    }
};
