import React, {FunctionComponent} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ActorCTO} from '../../../dataAccess/access/cto/ActorCTO';
import {DataCTO} from '../../../dataAccess/access/cto/DataCTO';
import {DataSetupCTO} from '../../../dataAccess/access/cto/DataSetupCTO';
import {SequenceStepCTO} from '../../../dataAccess/access/cto/SequenceStepCTO';
import {ActionTO} from '../../../dataAccess/access/to/ActionTO';
import {DecisionTO} from '../../../dataAccess/access/to/DecisionTO';
import {InitDataTO} from '../../../dataAccess/access/to/InitDataTO';
import {PositionTO} from '../../../dataAccess/access/to/PositionTO';
import {ActionType} from '../../../dataAccess/access/types/ActionType';
import {EditActions, editSelectors} from '../../../slices/EditSlice';
import {MasterDataActions, masterDataSelectors} from '../../../slices/MasterDataSlice';
import {sequenceModelSelectors} from '../../../slices/SequenceModelSlice';
import {DavitUtil} from '../../../utils/DavitUtil';
import {ActorData} from '../../../viewDataTypes/ActorData';
import {ActorDataState} from '../../../viewDataTypes/ActorDataState';
import {ViewFragmentProps} from '../../../viewDataTypes/ViewFragment';
import {Arrow} from '../../common/fragments/svg/Arrow';
import {ActorDnDBox} from './fragments/ActorDnDBox';
import {Carv2Card, Carv2CardProps} from './fragments/Carv2Card';

interface ActorModelControllerProps {
  fullScreen?: boolean;
}

export const ActorModelController: FunctionComponent<ActorModelControllerProps> = (props) => {
  const {fullScreen} = props;

  const {onPositionUpdate, getArrows, toDnDElements} = useViewModel();

  const mapCardToJSX = (card: Carv2CardProps): JSX.Element => {
    return <Carv2Card {...card} />;
  };

  return (
    <ActorDnDBox
      onPositionUpdate={onPositionUpdate}
      arrows={getArrows()}
      toDnDElements={toDnDElements.map((el) => {
        return {...el, element: mapCardToJSX(el.card)};
      })}
      fullScreen={fullScreen}
    />
  );
};

const useViewModel = () => {
  const dispatch = useDispatch();
  // ====== SELECTORS =====
  const actors: ActorCTO[] = useSelector(masterDataSelectors.actors);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  // ----- EDIT -----
  const actorCTOToEdit: ActorCTO | null = useSelector(editSelectors.actorToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const decisionToEdit: DecisionTO | null = useSelector(editSelectors.decisionToEdit);
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
  const initDataToEdit: InitDataTO | null = useSelector(editSelectors.initDataToEdit);
  const editArrow: Arrow | null = useSelector(editSelectors.editActionArrow);
  const editStepArrows: Arrow[] = useSelector(editSelectors.editStepArrows);
  // ----- VIEW -----
  const arrows: Arrow[] = useSelector(sequenceModelSelectors.selectCurrentArrows);
  const currentActorDatas: ActorData[] = useSelector(sequenceModelSelectors.selectActorData);
  const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);
  // const actions: ActionTO[] = useSelector(sequenceModelSelectors.selectActions);
  const dataSetup: DataSetupCTO | null = useSelector(sequenceModelSelectors.selectDataSetup);

  React.useEffect(() => {
    dispatch(MasterDataActions.loadActorsFromBackend());
    dispatch(MasterDataActions.loadGroupsFromBackend());
  }, [dispatch]);

  const getActorDatas = () => {
    const actorDatas: ViewFragmentProps[] = [];
    actorDatas.push(...getActorDatasFromView());
    actorDatas.push(...getActorDatasFromEdit());
    return actorDatas;
  };

  const getActorDatasFromView = (): ViewFragmentProps[] => {
    const actorDatas: ViewFragmentProps[] = [];
    const actorDatasFromErros: ViewFragmentProps[] = errors.map(mapErrorToActorDatas);


    const actorDatasFromCompDatas: ViewFragmentProps[] = currentActorDatas.map(mapActorDataToViewFramgent).sort((a, b) => a.name.localeCompare(b.name));
    actorDatas.push(...actorDatasFromErros);

    actorDatas.push(
        ...actorDatasFromCompDatas.filter(
            (actorDataFromActorData) => !actorDatas.some((cp) => actorDataExists(cp, actorDataFromActorData)),
        ),
    );
    return actorDatas;
  };

  const getActorDatasFromEdit = (): ViewFragmentProps[] => {
    const actorDatas: ViewFragmentProps[] = [];
    const actorDatasFromStepToEdit: (ViewFragmentProps | undefined)[] = stepToEdit?.actions.map((action) => action? mapActionToActorDatas(action) : []).flat(1) || [];
    const actorDataFromActionToEdit: ViewFragmentProps[] = actionToEdit
      ? mapActionToActorDatas(actionToEdit)
      : [];
    const actorDataFromDecisionToEdit: ViewFragmentProps[] = mapDecisionToActorData(decisionToEdit);
    const actorDatasFromDataSetupEdit: ViewFragmentProps[] = dataSetupToEdit
      ? dataSetupToEdit.initDatas.map(mapInitDataToActorData)
      : [];
    const actorDatasFromDataSetupView: ViewFragmentProps[] = dataSetup
      ? dataSetup.initDatas.map(mapInitDataToActorData)
      : [];
    const actorDatasFromInitData: ViewFragmentProps | undefined = initDataToEdit
      ? mapInitDataToActorData(initDataToEdit)
      : undefined;
    actorDatasFromStepToEdit.forEach((actorData) => {
      actorData && actorDatas.push(actorData);
    });
    actorDatas.push(...actorDataFromDecisionToEdit);
    actorDatas.push(...actorDatasFromDataSetupEdit);
    if (currentActorDatas.length <= 0) {
      actorDatas.push(...actorDatasFromDataSetupView);
    }
    actorDatas.push(...actorDataFromActionToEdit);
    if (actorDatasFromInitData) {
      actorDatas.push(actorDatasFromInitData);
    }
    return actorDatas;
  };

  const actorDataExists = (propOne: ViewFragmentProps, propTwo: ViewFragmentProps) => {
    return propOne.parentId === propTwo.parentId && propOne.name === propTwo.name;
  };

  const mapActionToActorDatas = (actionItem: ActionTO): ViewFragmentProps[] => {
    const state: ActorDataState = mapActionTypeToViewFragmentState(actionItem.actionType);
    const parentId = state === ActorDataState.SENT ? actionItem.sendingActorFk : actionItem.receivingActorFk;

    const viewFragmentProps: ViewFragmentProps[] = [];
    viewFragmentProps.push({
      name: getDataNameById(actionItem.dataFk, actionItem.instanceFk),
      state: state,
      parentId: parentId,
    });

    if (actionItem.actionType===ActionType.SEND_AND_DELETE) {
      viewFragmentProps.push({
        name: getDataNameById(actionItem.dataFk, actionItem.instanceFk),
        state: ActorDataState.DELETED,
        parentId: actionItem.sendingActorFk,
      });
    }

    return viewFragmentProps;
  };

  const mapErrorToActorDatas = (errorItem: ActionTO): ViewFragmentProps => {
    const state: ActorDataState = mapErrorTypeToViewFragmentState(errorItem.actionType);

    const parentId = state === ActorDataState.ERROR_SEND ? errorItem.sendingActorFk : errorItem.receivingActorFk;

    return {
      name: getDataNameById(errorItem.dataFk, errorItem.instanceFk),
      state: state,
      parentId: parentId,
    };
  };

  const mapActorDataToViewFramgent = (actorData: ActorData): ViewFragmentProps => {
    return {
      name: getDataNameById(actorData.dataFk, actorData.instanceFk),
      parentId: actorData.actorFk,
      state: actorData.state,
    };
  };

  const mapDecisionToActorData = (decision: DecisionTO | null): ViewFragmentProps[] => {
    let props: ViewFragmentProps[] = [];
    if (decision) {
      if (decision.dataAndInstaceIds !== undefined && decision.dataAndInstaceIds.length > 0) {
        props = decision.dataAndInstaceIds.map((data) => {
          return {
            parentId: decision.actorFk,
            name: getDataNameById(data.dataFk, data.instanceId),
            state: ActorDataState.CHECKED,
          };
        });
      }
    }
    return props;
  };

  const mapInitDataToActorData = (initData: InitDataTO): ViewFragmentProps => {
    return {
      parentId: initData.actorFk,
      name: getDataNameById(initData.dataFk, initData.instanceFk),
      state: ActorDataState.NEW,
    };
  };

  const getDataNameById = (dataId: number, instanceId?: number): string => {
    let dataName: string = 'Could not find Data';
    const data: DataCTO | undefined = datas.find((data) => data.data.id === dataId);
    if (data) {
      dataName = data.data.name;
      if (instanceId !== undefined && instanceId!==-1) {
        dataName
          = dataName + ' - ' + (data.data.instances.find((inst) => inst.id === instanceId)?.name
          || 'Could not find instance Name');
      }
    }
    return dataName;
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
      case ActionType.SEND_AND_DELETE:
        cdState = ActorDataState.SENT;
        break;
    }
    return cdState;
  };

  const mapErrorTypeToViewFragmentState = (actionType: ActionType): ActorDataState => {
    let cdState: ActorDataState;
    switch (actionType) {
      case ActionType.ADD:
        cdState = ActorDataState.ERROR_ADD;
        break;
      case ActionType.DELETE:
        cdState = ActorDataState.ERROR_DELETE;
        break;
      case ActionType.SEND:
      case ActionType.SEND_AND_DELETE:
        cdState = ActorDataState.ERROR_SEND;
        break;
    }
    return cdState;
  };

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const actorCTO = actors.find((actorCTO) => actorCTO.geometricalData.position.id === positionId);
    if (actorCTO) {
      const copyActorCTO: ActorCTO = DavitUtil.deepCopy(actorCTO);
      copyActorCTO.geometricalData.position.x = x;
      copyActorCTO.geometricalData.position.y = y;
      dispatch(EditActions.actor.save(copyActorCTO));
    }
  };

  const toDnDElements = (actors: ActorCTO[]): { card: Carv2CardProps; position: PositionTO }[] => {
    let cards: { card: Carv2CardProps; position: PositionTO }[] = [];
    cards = actors
        .filter((actor) => !(actorCTOToEdit && actorCTOToEdit.actor.id === actor.actor.id))
        .map((actorr) => {
          return {
            card: actorToCard(actorr),
            position: actorr.geometricalData.position,
          };
        })
        .filter((item) => item !== undefined);
    // add actor to edit
    if (actorCTOToEdit) {
      cards.push({
        card: actorToCard(actorCTOToEdit),
        position: actorCTOToEdit.geometricalData.position,
      });
    }
    return cards;
  };

  const actorToCard = (actor: ActorCTO): Carv2CardProps => {
    return {
      id: actor.actor.id,
      initName: actor.actor.name,
      initWidth: actor.geometricalData.geometricalData.width,
      initHeigth: actor.geometricalData.geometricalData.height,
      dataFragments: getActorDatas().filter(
          (act) =>
            act.parentId === actor.actor.id
          || (act.parentId as { dataId: number; instanceId: number }).dataId === actor.actor.id,
      ),
      zoomFactor: 1,
      type: 'ACTOR',
    };
  };

  const getArrows = (): Arrow[] => {
    let ar: Arrow[] = [];
    ar = arrows;
    if (editArrow) {
      console.info('edit arrows: ', editArrow);
      ar.push(editArrow);
    }
    ar.push(...editStepArrows);
    return ar;
  };

  return {
    onPositionUpdate,
    getArrows,
    toDnDElements: toDnDElements(actors),
  };
};
