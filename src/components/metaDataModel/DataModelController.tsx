import React, {FunctionComponent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ActorCTO} from "../../dataAccess/access/cto/ActorCTO";
import {DataCTO} from "../../dataAccess/access/cto/DataCTO";
import {DataSetupCTO} from "../../dataAccess/access/cto/DataSetupCTO";
import {GeometricalDataCTO} from "../../dataAccess/access/cto/GeometraicalDataCTO";
import {SequenceStepCTO} from "../../dataAccess/access/cto/SequenceStepCTO";
import {ActionTO} from "../../dataAccess/access/to/ActionTO";
import {ConditionTO} from "../../dataAccess/access/to/ConditionTO";
import {DataRelationTO} from "../../dataAccess/access/to/DataRelationTO";
import {DecisionTO} from "../../dataAccess/access/to/DecisionTO";
import {InitDataTO} from "../../dataAccess/access/to/InitDataTO";
import {ActionType} from "../../dataAccess/access/types/ActionType";
import {editSelectors} from "../../slices/EditSlice";
import {GlobalActions, globalSelectors} from "../../slices/GlobalSlice";
import {MasterDataActions, masterDataSelectors} from "../../slices/MasterDataSlice";
import {sequenceModelSelectors} from "../../slices/SequenceModelSlice";
import {EditData} from "../../slices/thunks/DataThunks";
import {DavitUtil} from "../../utils/DavitUtil";
import {ActorData} from "../../viewDataTypes/ActorData";
import {ActorDataState} from "../../viewDataTypes/ActorDataState";
import {ViewFragmentProps} from "../../viewDataTypes/ViewFragment";
import {DavitPathProps, DavitPathTypes} from "../common/fragments/svg/DavitPath";
import {DavitCard, DavitCardProps} from "../common/fragments/DavitCard";
import {DnDBox, DnDBoxElement, DnDBoxType} from "../common/fragments/DnDBox";

interface DataModelControllerProps {
    fullScreen?: boolean;
}

export const DataModelController: FunctionComponent<DataModelControllerProps> = (props) => {
    const {fullScreen} = props;

    const {
        onPositionUpdate,
        toDnDElements,
        zoomIn,
        zoomOut,
        getRelations,
        onGeometricalDataUpdate,
        dataZoomFactor,
    } = useMetaDataModelViewModel();

    const createMetaDataDnDBox = () => {
        return (
            <DnDBox
                onPositionUpdate={onPositionUpdate}
                toDnDElements={toDnDElements}
                svgElements={getRelations()}
                fullScreen={fullScreen}
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoom={dataZoomFactor}
                type={DnDBoxType.data}
                onGeoUpdate={onGeometricalDataUpdate}
            />
        );
    };

    return createMetaDataDnDBox();
};

const useMetaDataModelViewModel = () => {
    const dispatch = useDispatch();
    // ====== SELECTORS =====
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);
    const dataCTOToEdit: DataCTO | null = useSelector(editSelectors.selectDataToEdit);
    const dataRelations: DataRelationTO[] = useSelector(masterDataSelectors.selectRelations);
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    // ----- EDIT -----
    const dataRelationToEdit: DataRelationTO | null = useSelector(editSelectors.selectRelationToEdit);
    const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.selectStepToEdit);
    const actionToEdit: ActionTO | null = useSelector(editSelectors.selectActionToEdit);
    const decisionToEdit: DecisionTO | null = useSelector(editSelectors.selectDecisionToEdit);
    const conditionToEdit: ConditionTO | null = useSelector(editSelectors.selectConditionToEdit);
    const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.selectDataSetupToEdit);
    const initDataToEdit: InitDataTO | null = useSelector(editSelectors.selectInitDataToEdit);
    // ----- VIEW -----
    const currentActorDatas: ActorData[] = useSelector(sequenceModelSelectors.selectActorData);
    const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);
    const actions: ActionTO[] = useSelector(sequenceModelSelectors.selectActions);

    const dataZoomFactor: number = useSelector(globalSelectors.selectDataZoomFactor);

    React.useEffect(() => {
        dispatch(MasterDataActions.loadDatasFromBackend());
        dispatch(MasterDataActions.loadRelationsFromBackend());
    }, [dispatch]);

    const getActorNameById = (actorId: number): string => {
        return actors.find((actor) => actor.actor.id === actorId)?.actor.name || "Could not find Actor";
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

        const actorDatasFromCompDatas: ViewFragmentProps[] = currentActorDatas
            .filter((actDat) => actDat.state !== ActorDataState.UPDATED_FROM)
            .map(mapActorDataToActorData);
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
        if (conditionToEdit) {
            actorDatas.push(mapConditionToCompData(conditionToEdit));
        }
        return actorDatas;
    };

    function mapActionToActorDatas(actionItem: ActionTO): ViewFragmentProps {
        const state: ActorDataState = mapActionTypeToViewFragmentState(actionItem.actionType);
        // const parentId = getDataAndInstanceIds(actionItem.dataFk);
        return {
            name: getActorNameById(actionItem.receivingActorFk),
            state: state,
            parentId: actionItem.dataFk,
        };
    }

    const mapActorDataToActorData = (actorData: ActorData): ViewFragmentProps => {
        return {
            name: getActorNameById(actorData.actorFk),
            parentId: {dataId: actorData.dataFk, instanceId: actorData.instanceFk},
            state: ActorDataState.PERSISTENT,
        };
    };

    const mapDecisionToCompData = (decision: DecisionTO | null): ViewFragmentProps[] => {
        let props: ViewFragmentProps[] = [];
        if (decision) {
            if (decision.conditions !== undefined && decision.conditions.length > 0) {
                props = decision.conditions.map((condition) => {
                    return mapConditionToCompData(condition);
                });
            }
        }
        return props;
    };

    const mapConditionToCompData = (condition: ConditionTO): ViewFragmentProps => {
        return {
            parentId: {dataId: condition.dataFk, instanceId: condition.instanceFk},
            name: getActorNameById(condition.actorFk),
            state: ActorDataState.CHECKED,
        };
    };

    const mapInitDataToCompData = (initData: InitDataTO): ViewFragmentProps => {
        return {
            parentId:
                initData.instanceFk > 1
                    ? {dataId: initData.dataFk, instanceId: initData.instanceFk}
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
            case ActionType.TRIGGER:
                cdState = ActorDataState.PERSISTENT;
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
            dispatch(EditData.save(copyDataCTO));
        }
    };

    const dataToDnDElements = (datas: DataCTO[]): DnDBoxElement[] => {
        let dndBoxElements: DnDBoxElement[];
        dndBoxElements = datas
            .filter((data) => !(dataCTOToEdit && dataCTOToEdit.data.id === data.data.id))
            .map((dataa) => {
                return {
                    element: <DavitCard {...dataToCard(dataa)} />,
                    position: dataa.geometricalData.position,
                    geometricalData: dataa.geometricalData.geometricalData,
                };
            })
            .filter((item) => item !== undefined);
        // add data to edit
        if (dataCTOToEdit) {
            dndBoxElements.push({
                element: <DavitCard {...dataToCard(dataCTOToEdit)} />,
                position: dataCTOToEdit.geometricalData.position,
                geometricalData: dataCTOToEdit.geometricalData.geometricalData,
            });
        }
        return dndBoxElements;
    };

    const dataToCard = (data: DataCTO): DavitCardProps => {
        return {
            id: data.data.id,
            initName: data.data.name,
            initWidth: 100,
            initHeigth: 30,
            dataFragments: getActorDatas().filter(
                (act) =>
                    act.parentId === data.data.id ||
                    (act.parentId as { dataId: number; instanceId: number }).dataId === data.data.id,
            ),
            instances: data.data.instances,
            zoomFactor: dataZoomFactor,
            type: "DATA",
        };
    };

    const zoomOut = (): void => {
        dispatch(GlobalActions.dataZoomOut());
    };

    const zoomIn = (): void => {
        dispatch(GlobalActions.dataZoomIn());
    };

    const getGeometricalData = (dataId: number): GeometricalDataCTO | undefined => {
        return datas.find((data) => data.data.id === dataId)?.geometricalData || undefined;
    };

    const relationToDavitPath = (relation: DataRelationTO, id: number, isEdit?: boolean): DavitPathProps => {
        const sourceGeometricalData: GeometricalDataCTO | undefined = getGeometricalData(relation.data1Fk);
        const targetGeometricalData: GeometricalDataCTO | undefined = getGeometricalData(relation.data2Fk);

        return {
            id: id,
            labels: [],
            lineType: DavitPathTypes.GRID,
            xSource: sourceGeometricalData?.position.x || 0,
            ySource: sourceGeometricalData?.position.y || 0,
            xTarget: targetGeometricalData?.position.x || 0,
            yTarget: targetGeometricalData?.position.y || 0,
            sourceHeight: sourceGeometricalData?.geometricalData.height || 0,
            sourceWidth: sourceGeometricalData?.geometricalData.width || 0,
            targetHeight: targetGeometricalData?.geometricalData.height || 0,
            targetWidth: targetGeometricalData?.geometricalData.width || 0,
            stroked: isEdit,
            sourceDirection: relation.direction1,
            targetDirection: relation.direction2,
        };
    };

    const getRelations = (): DavitPathProps[] => {
        let dataRelationsProps: DavitPathProps[] = [];

        let copyDataRelations: DataRelationTO[] = DavitUtil.deepCopy(dataRelations);

        if (dataRelationToEdit) {
            copyDataRelations = copyDataRelations.filter((relation) => relation.id !== dataRelationToEdit.id);
            dataRelationsProps.push(relationToDavitPath(dataRelationToEdit, dataRelationToEdit.id, true));
        }

        copyDataRelations.forEach((rel) => dataRelationsProps.push(relationToDavitPath(rel, rel.id)));
        return dataRelationsProps;
    };

    const onGeometricalDataUpdate = (width: number, height: number, geoId: number) => {
        const copyData: DataCTO | undefined = DavitUtil.deepCopy(
            datas.find((data) => data.geometricalData.geometricalData.id === geoId),
        );
        if (copyData) {
            copyData.geometricalData.geometricalData.width = width;
            copyData.geometricalData.geometricalData.height = height;
            dispatch(EditData.save(copyData));
        }
    };

    return {
        onPositionUpdate,
        toDnDElements: dataToDnDElements(datas),
        zoomIn,
        zoomOut,
        getRelations,
        onGeometricalDataUpdate,
        dataZoomFactor,
    };
};
