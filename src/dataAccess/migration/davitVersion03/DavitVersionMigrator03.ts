import { DAVIT_VERISON } from "../../../DavitConstants";
import { ActionTO } from "../../access/to/ActionTO";
import { ActorTO } from "../../access/to/ActorTO";
import { ChainDecisionTO } from "../../access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../access/to/ChainlinkTO";
import { ChainTO } from "../../access/to/ChainTO";
import { DataRelationTO } from "../../access/to/DataRelationTO";
import { DataSetupTO } from "../../access/to/DataSetupTO";
import { DataTO } from "../../access/to/DataTO";
import { DecisionTO } from "../../access/to/DecisionTO";
import { GeometricalDataTO } from "../../access/to/GeometricalDataTO";
import { GroupTO } from "../../access/to/GroupTO";
import { InitDataTO } from "../../access/to/InitDataTO";
import { PositionTO } from "../../access/to/PositionTO";
import { SequenceStepTO } from "../../access/to/SequenceStepTO";
import { SequenceTO } from "../../access/to/SequenceTO";
import { StoreTO } from "../../access/to/StoreTO";
import { StoreTO02 } from "../davitVersion02/to/StoreTO02";

export const DavitVersionMigrator03 = {
    migrate(dataStoreObject: StoreTO02): StoreTO {
        console.info("start migration to version 0.3");
        const actorZoom: number = dataStoreObject.actorZoom;
        const dataZoom: number = dataStoreObject.dataZoom;

        return {
            version: DAVIT_VERISON,
            projectName: dataStoreObject.projectName,
            actorZoom: actorZoom,
            dataZoom: dataZoom,

            actors: dataStoreObject.actors as ActorTO[],
            groups: dataStoreObject.groups as GroupTO[],
            geometricalDatas: dataStoreObject.geometricalDatas as GeometricalDataTO[],
            positions: dataStoreObject.positions as PositionTO[],
            designs: dataStoreObject.designs as DecisionTO[],
            sequences: dataStoreObject.sequences as SequenceTO[],
            steps: dataStoreObject.steps as SequenceStepTO[],
            actions: dataStoreObject.actions as ActionTO[],
            decisions: dataStoreObject.decisions as DecisionTO[],
            datas: dataStoreObject.datas as DataTO[],
            dataConnections: dataStoreObject.dataConnections as DataRelationTO[],
            initDatas: dataStoreObject.initDatas as InitDataTO[],
            dataSetups: dataStoreObject.dataSetups as DataSetupTO[],
            chains: dataStoreObject.chains as ChainTO[],
            chainlinks: dataStoreObject.chainlinks as ChainlinkTO[],
            chaindecisions: dataStoreObject.chaindecisions as ChainDecisionTO[],
            sequenceMocks: [],
            chainMocks: [],
        };
    },
};
