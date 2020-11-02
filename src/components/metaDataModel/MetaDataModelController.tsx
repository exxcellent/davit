import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ActorCTO} from '../../dataAccess/access/cto/ActorCTO';
import {DataCTO} from '../../dataAccess/access/cto/DataCTO';
import {DataSetupCTO} from '../../dataAccess/access/cto/DataSetupCTO';
import {SequenceStepCTO} from '../../dataAccess/access/cto/SequenceStepCTO';
import {ActionTO} from '../../dataAccess/access/to/ActionTO';
import {DataRelationTO} from '../../dataAccess/access/to/DataRelationTO';
import {DecisionTO} from '../../dataAccess/access/to/DecisionTO';
import {InitDataTO} from '../../dataAccess/access/to/InitDataTO';
import {ActionType} from '../../dataAccess/access/types/ActionType';
import {EditActions, editSelectors} from '../../slices/EditSlice';
import {MasterDataActions, masterDataSelectors} from '../../slices/MasterDataSlice';
import {SequenceModelActions, sequenceModelSelectors} from '../../slices/SequenceModelSlice';
import {ActorData} from '../../viewDataTypes/ActorData';
import {ActorDataState} from '../../viewDataTypes/ActorDataState';
import {ViewFragmentProps} from '../../viewDataTypes/ViewFragment';
import {MetaDataDnDBox} from './fragments/MetaDataDnDBox';

interface MetaDataModelControllerProps {
  fullScreen?: boolean;
}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (props) => {
  const {fullScreen} = props;

  const {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    getActorDatas,
    saveData,
    handleDataClick,
  } = useMetaDataModelViewModel();

  const createMetaDataDnDBox = () => {
    return (
      <MetaDataDnDBox
        dataCTOs={datas}
        onSaveCallBack={saveData}
        dataRelations={dataRelations}
        dataCTOToEdit={dataCTOToEdit}
        dataRelationToEdit={dataRelationToEdit}
        actorDatas={getActorDatas()}
        onClick={handleDataClick}
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

  React.useEffect(() => {
    dispatch(MasterDataActions.loadDatasFromBackend());
    dispatch(MasterDataActions.loadRelationsFromBackend());
  }, [dispatch]);

  const saveData = (dataCTO: DataCTO) => {
    dispatch(EditActions.data.save(dataCTO));
    dispatch(MasterDataActions.loadRelationsFromBackend());
    if (dataCTO.data.id === dataRelationToEdit?.data1Fk) {
      dispatch(EditActions.setMode.editRelation(dataRelationToEdit));
    }
    if (dataCTO.data.id === dataRelationToEdit?.data2Fk) {
      dispatch(EditActions.setMode.editRelation(dataRelationToEdit));
    }
  };

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
      parentId: {dataId: actorData.dataFk, instanceId: actorData.instanceFk},
      state: ActorDataState.PERSISTENT,
    };
  };

  const mapDecisionToCompData = (decision: DecisionTO | null): ViewFragmentProps[] => {
    let props: ViewFragmentProps[] = [];
    if (decision) {
      if (decision.dataAndInstaceId !== undefined && decision.dataAndInstaceId.length > 0) {
        props = decision.dataAndInstaceId.map((data) => {
          return {
            parentId: {dataId: data.dataFk, instanceId: data.instanceId},
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
        initData.instanceFk > 1 ? {dataId: initData.dataFk, instanceId: initData.instanceFk} : initData.dataFk,
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
      (dataId1 === dataId2 || propOne.parentId === propTwo.parentId)
      && propOne.name === propTwo.name
      && (!(instanceId1 || instanceId2) || instanceId1 === instanceId2)
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

  return {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    saveData,
    getActorDatas,
    handleDataClick: (dataId: number) => dispatch(SequenceModelActions.handleDataClickEvent(dataId)),
  };
};
