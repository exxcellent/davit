import React, { FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ActorCTO } from '../../dataAccess/access/cto/ActorCTO';
import { DataCTO } from '../../dataAccess/access/cto/DataCTO';
import { DataSetupCTO } from '../../dataAccess/access/cto/DataSetupCTO';
import { SequenceStepCTO } from '../../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../../dataAccess/access/to/ActionTO';
import { DataRelationTO } from '../../dataAccess/access/to/DataRelationTO';
import { DecisionTO } from '../../dataAccess/access/to/DecisionTO';
import { InitDataTO } from '../../dataAccess/access/to/InitDataTO';
import { PositionTO } from '../../dataAccess/access/to/PositionTO';
import { ActionType } from '../../dataAccess/access/types/ActionType';
import { EditActions, editSelectors } from '../../slices/EditSlice';
import { MasterDataActions, masterDataSelectors } from '../../slices/MasterDataSlice';
import { SequenceModelActions, sequenceModelSelectors } from '../../slices/SequenceModelSlice';
import { DavitUtil } from '../../utils/DavitUtil';
import { ActorData } from '../../viewDataTypes/ActorData';
import { ActorDataState } from '../../viewDataTypes/ActorDataState';
import { ViewFragmentProps } from '../../viewDataTypes/ViewFragment';
import { DavitPath } from '../common/fragments/svg/DavitPath';
import { DavitCard, DavitCardProps } from '../metaComponentModel/presentation/fragments/DavitCard';
import { DnDBox, DnDBoxType } from '../metaComponentModel/presentation/fragments/DnDBox';

interface MetaDataModelControllerProps {
    fullScreen?: boolean;
}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (props) => {
    const { fullScreen } = props;

    const { onPositionUpdate, toDnDElements, zoomIn, zoomOut, getRelations } = useMetaDataModelViewModel();

    const mapCardToJSX = (card: DavitCardProps): JSX.Element => {
        return <DavitCard {...card} />;
    };

    const createMetaDataDnDBox = () => {
        return (
            <DnDBox
                onPositionUpdate={onPositionUpdate}
                paths={getRelations()}
                toDnDElements={toDnDElements.map((el) => {
                    return { ...el, element: mapCardToJSX(el.card) };
                })}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                type={DnDBoxType.data}
                fullScreen={fullScreen}
            />
        );
    };

    return createMetaDataDnDBox();
};

const useMetaDataModelViewModel = () => {
    const dispatch = useDispatch();
    // ====== SELECTORS =====
    const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
    const dataCTOToEdit: DataCTO | null = useSelector(editSelectors.dataToEdit);
    const dataRelations: DataRelationTO[] = useSelector(masterDataSelectors.relations);
    const actors: ActorCTO[] = useSelector(masterDataSelectors.actors);
    // ----- EDIT -----
    const dataRelationToEdit: DataRelationTO | null = useSelector(editSelectors.relationToEdit);
    const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
    const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
    const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
    const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
    const initDataToEdit: InitDataTO | null = useSelector(editSelectors.initDataToEdit);
    // ----- VIEW -----
    const currentActorDatas: ActorData[] = useSelector(sequenceModelSelectors.selectActorData);
    const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);
    const actions: ActionTO[] = useSelector(sequenceModelSelectors.selectActions);

    const [zoom, setZoom] = useState<number>(1);

    const ZOOM_FACTOR: number = 0.1;

    React.useEffect(() => {
        dispatch(MasterDataActions.loadDatasFromBackend());
        dispatch(MasterDataActions.loadRelationsFromBackend());
    }, [dispatch]);

    const getActorNameById = (actorId: number): string => {
        return actors.find((actor) => actor.actor.id === actorId)?.actor.name || 'Could not find Actor';
    };

    const getActorDatas = () => {
        const actorDatas: ViewFragmentProps[] = [];
        actorDatas.push(...getActorDatasFromView());
        actorDatas.push(...getActorDatasFromEdit());
        return actorDatas;
    };

    const getActorDatasFromView = (): ViewFragmentProps[] => {
        const actorDatas: ViewFragmentProps[] = [];
        const actorDatasFromErros: ViewFragmentProps[] = errors.map(mapActionToActorDatas);
        const actorDatasFromActions: ViewFragmentProps[] = actions.map(mapActionToActorDatas);

        const actorDatasFromCompDatas: ViewFragmentProps[] = currentActorDatas.map(mapActorDataToActorData);
        actorDatas.push(...actorDatasFromErros);
        actorDatas.push(
            ...actorDatasFromActions.filter(
                (actorDataFromAction) => !actorDatas.some((cp) => actorDataExists(cp, actorDataFromAction)),
            ),
        );
        actorDatas.push(
            ...actorDatasFromCompDatas.filter(
                (actorDataFromCompData) => !actorDatas.some((cp) => actorDataExists(cp, actorDataFromCompData)),
            ),
        );
        return actorDatas;
    };

    const getActorDatasFromEdit = (): ViewFragmentProps[] => {
        const actorDatas: ViewFragmentProps[] = [];
        const actorDatasFromStepToEdit: ViewFragmentProps[] = stepToEdit?.actions.map(mapActionToActorDatas) || [];
        const actorDataFromActionToEdit: ViewFragmentProps | undefined = actionToEdit
            ? mapActionToActorDatas(actionToEdit)
            : undefined;
        const actorDataFromInitDataToEdit: ViewFragmentProps | undefined = initDataToEdit
            ? mapInitDataToCompData(initDataToEdit)
            : undefined;
        const actorDataFromDecisionToEdit: ViewFragmentProps[] = mapDecisionToCompData(decisionToEdit);
        const actorDatasFromDataSetup: ViewFragmentProps[] = dataSetupToEdit
            ? dataSetupToEdit.initDatas.map(mapInitDataToCompData)
            : [];
        actorDatas.push(...actorDatasFromStepToEdit);
        actorDatas.push(...actorDataFromDecisionToEdit);
        actorDatas.push(...actorDatasFromDataSetup);
        if (actorDataFromActionToEdit) {
            actorDatas.push(actorDataFromActionToEdit);
        }
        if (actorDataFromInitDataToEdit) {
            actorDatas.push(actorDataFromInitDataToEdit);
        }
        return actorDatas;
    };

    function mapActionToActorDatas(actionItem: ActionTO): ViewFragmentProps {
        const state: ActorDataState = mapActionTypeToViewFragmentState(actionItem.actionType);
        // const parentId = getDataAndInstanceIds(actionItem.dataFk);
        const parentId = actionItem.dataFk;
        return {
            name: getActorNameById(actionItem.receivingActorFk),
            state: state,
            parentId: parentId,
        };
    }

    const mapActorDataToActorData = (actorData: ActorData): ViewFragmentProps => {
        return {
            name: getActorNameById(actorData.actorFk),
            parentId: { dataId: actorData.dataFk, instanceId: actorData.instanceFk },
            state: ActorDataState.PERSISTENT,
        };
    };

    const mapDecisionToCompData = (decision: DecisionTO | null): ViewFragmentProps[] => {
        let props: ViewFragmentProps[] = [];
        if (decision) {
            if (decision.dataAndInstaceIds !== undefined && decision.dataAndInstaceIds.length > 0) {
                props = decision.dataAndInstaceIds.map((data) => {
                    return {
                        parentId: { dataId: data.dataFk, instanceId: data.instanceId },
                        name: getActorNameById(decision.actorFk),
                        state: ActorDataState.CHECKED,
                    };
                });
            }
        }
        return props;
    };

    const mapInitDataToCompData = (initData: InitDataTO): ViewFragmentProps => {
        return {
            parentId:
                initData.instanceFk > 1
                    ? { dataId: initData.dataFk, instanceId: initData.instanceFk }
                    : initData.dataFk,
            name: getActorNameById(initData.actorFk),
            state: ActorDataState.NEW,
        };
    };

    const actorDataExists = (propOne: ViewFragmentProps, propTwo: ViewFragmentProps) => {
        const dataId1 = (propOne.parentId as { dataId: number; instanceId: number }).dataId || propOne.parentId;
        const instanceId1 = (propOne.parentId as {
            dataId: number;
            instanceId: number;
        }).instanceId;
        const dataId2 = (propTwo.parentId as { dataId: number; instanceId: number }).dataId || propTwo.parentId;
        const instanceId2 = (propTwo.parentId as {
            dataId: number;
            instanceId: number;
        }).instanceId;
        return (
            (dataId1 === dataId2 || propOne.parentId === propTwo.parentId) &&
            propOne.name === propTwo.name &&
            (!(instanceId1 || instanceId2) || instanceId1 === instanceId2)
        );
    };

    const mapActionTypeToViewFragmentState = (actionType: ActionType): ActorDataState => {
        let cdState: ActorDataState;
        switch (actionType) {
            case ActionType.ADD:
                cdState = ActorDataState.NEW;
                break;
            case ActionType.DELETE:
                cdState = ActorDataState.DELETED;
                break;
            case ActionType.SEND:
                cdState = ActorDataState.NEW;
                break;
            case ActionType.SEND_AND_DELETE:
                cdState = ActorDataState.NEW;
                break;
        }
        return cdState;
    };

    const onPositionUpdate = (x: number, y: number, positionId: number) => {
        const dataCTO = datas.find((data) => data.geometricalData.position.id === positionId);
        if (dataCTO) {
            const copyDataCTO: DataCTO = DavitUtil.deepCopy(dataCTO);
            copyDataCTO.geometricalData.position.x = x;
            copyDataCTO.geometricalData.position.y = y;
            dispatch(EditActions.data.save(copyDataCTO));
        }
    };

    const toDnDElements = (datas: DataCTO[]): { card: DavitCardProps; position: PositionTO }[] => {
        let cards: { card: DavitCardProps; position: PositionTO }[] = [];
        cards = datas
            .filter((data) => !(dataCTOToEdit && dataCTOToEdit.data.id === data.data.id))
            .map((dataa) => {
                return {
                    card: dataToCard(dataa),
                    position: dataa.geometricalData.position,
                };
            })
            .filter((item) => item !== undefined);
        // add actor to edit
        if (dataCTOToEdit) {
            cards.push({
                card: dataToCard(dataCTOToEdit),
                position: dataCTOToEdit.geometricalData.position,
            });
        }
        return cards;
    };

    const dataToCard = (data: DataCTO): DavitCardProps => {
        return {
            id: data.data.id,
            initName: data.data.name,
            initWidth: data.geometricalData.geometricalData.width,
            initHeigth: data.geometricalData.geometricalData.height,
            dataFragments: getActorDatas().filter(
                (act) =>
                    act.parentId === data.data.id ||
                    (act.parentId as { dataId: number; instanceId: number }).dataId === data.data.id,
            ),
            instances: data.data.instances,
            zoomFactor: zoom,
            type: 'DATA',
        };
    };

    const zoomOut = (): void => {
        setZoom(zoom - ZOOM_FACTOR);
    };

    const zoomIn = (): void => {
        setZoom(zoom + ZOOM_FACTOR);
    };

    const relationToDavitPath = (relation: DataRelationTO, isEdit?: boolean): DavitPath => {
        return {
            source: datas.find((data) => data.data.id === relation.data1Fk)?.geometricalData || undefined,
            target: datas.find((data) => data.data.id === relation.data2Fk)?.geometricalData || undefined,
            dataRelation: relation,
            isEdit: isEdit,
        };
    };

    const getRelations = (): DavitPath[] => {
        let paths: DavitPath[] = [];
        let copyDataRelations: DataRelationTO[] = DavitUtil.deepCopy(dataRelations);
        if (dataRelationToEdit) {
            copyDataRelations = copyDataRelations.filter((relation) => relation.id !== dataRelationToEdit.id);
            paths.push(relationToDavitPath(dataRelationToEdit, true));
        }
        copyDataRelations.forEach((rel) => paths.push(relationToDavitPath(rel)));
        return paths;
    };

    return {
        handleDataClick: (dataId: number) => dispatch(SequenceModelActions.handleDataClickEvent(dataId)),
        onPositionUpdate,
        toDnDElements: toDnDElements(datas),
        zoomIn,
        zoomOut,
        getRelations,
    };
};
