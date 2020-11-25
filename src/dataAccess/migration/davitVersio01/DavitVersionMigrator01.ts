import { DAVIT_VERISON, DEFAULT_PROJECT_NAME } from '../../../app/DavitConstants';
import { ActionTO } from '../../access/to/ActionTO';
import { ActorTO } from '../../access/to/ActorTO';
import { ChainDecisionTO } from '../../access/to/ChainDecisionTO';
import { ChainlinkTO } from '../../access/to/ChainlinkTO';
import { ChainTO } from '../../access/to/ChainTO';
import { DataRelationTO } from '../../access/to/DataRelationTO';
import { DataSetupTO } from '../../access/to/DataSetupTO';
import { DataTO } from '../../access/to/DataTO';
import { DecisionTO } from '../../access/to/DecisionTO';
import { GeometricalDataTO } from '../../access/to/GeometricalDataTO';
import { GroupTO } from '../../access/to/GroupTO';
import { InitDataTO } from '../../access/to/InitDataTO';
import { PositionTO } from '../../access/to/PositionTO';
import { SequenceStepTO } from '../../access/to/SequenceStepTO';
import { SequenceTO } from '../../access/to/SequenceTO';
import { StoreTO } from '../../access/to/StoreTO';
import { ActionTO01 } from './to/ActionTO01';

export const DavitVersionMigrator01 = {
    migrate(dataStoreObject: StoreTO): StoreTO {
        console.info('start migration to version 0.1');
        const version: number = DAVIT_VERISON;
        const projectName: string = DEFAULT_PROJECT_NAME;

        const actors: ActorTO[] = dataStoreObject.actors as ActorTO[];
        const groups: GroupTO[] = dataStoreObject.groups as GroupTO[];
        const geometricalDatas: GeometricalDataTO[] = dataStoreObject.geometricalDatas as GeometricalDataTO[];
        const positions: PositionTO[] = dataStoreObject.positions as PositionTO[];
        const designs: DecisionTO[] = dataStoreObject.designs as DecisionTO[];
        const sequences: SequenceTO[] = dataStoreObject.sequences as SequenceTO[];
        const steps: SequenceStepTO[] = dataStoreObject.steps as SequenceStepTO[];
        const actions: ActionTO[] = (dataStoreObject.actions as ActionTO01[]).map((action) => {
            return {
                id: action.id,
                actionType: action.actionType,
                dataFk: action.dataFk,
                instanceFk: action.instanceFk,
                receivingActorFk: action.receivingActorFk,
                sendingActorFk: action.sendingActorFk,
                sequenceStepFk: action.sequenceStepFk,
                triggerText: '',
            };
        });
        const decisions: DecisionTO[] = dataStoreObject.decisions as DecisionTO[];
        const datas: DataTO[] = dataStoreObject.datas as DataTO[];
        const dataConnections: DataRelationTO[] = dataStoreObject.dataConnections as DataRelationTO[];
        const initDatas: InitDataTO[] = dataStoreObject.initDatas as InitDataTO[];
        const dataSetups: DataSetupTO[] = dataStoreObject.dataSetups as DataSetupTO[];
        const chains: ChainTO[] = dataStoreObject.chains as ChainTO[];
        const chainlinks: ChainlinkTO[] = dataStoreObject.chainlinks as ChainlinkTO[];
        const chaindecisions: ChainDecisionTO[] = dataStoreObject.chaindecisions as ChainDecisionTO[];

        return {
            version: version,
            projectName: projectName,
            actors: actors,
            groups: groups,
            geometricalDatas: geometricalDatas,
            positions: positions,
            designs: designs,
            sequences: sequences,
            steps: steps,
            actions: actions,
            decisions: decisions,
            datas: datas,
            dataConnections: dataConnections,
            initDatas: initDatas,
            dataSetups: dataSetups,
            chains: chains,
            chainlinks: chainlinks,
            chaindecisions: chaindecisions,
        };
    },
};
