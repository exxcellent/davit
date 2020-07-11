import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../dataAccess/access/to/ActionTO";
import { ConditionTO } from "../../../dataAccess/access/to/ConditionTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { ActionType } from "../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors } from "../../../slices/EditSlice";
import { MasterDataActions, masterDataSelectors } from "../../../slices/MasterDataSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { ComponentData } from "../../../viewDataTypes/ComponentData";
import { ViewFragmentProps } from "../../../viewDataTypes/ViewFragment";
import { ViewFragmentState } from "../../../viewDataTypes/ViewFragmentState";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps { }

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  const { components, getArrows, saveComp, groups, getCompDatas, componentCTOToEdit, handleComponentClickEvent } = useViewModel();

  return (
    <MetaComponentDnDBox
      componentCTOs={components}
      onSaveCallBack={saveComp}
      arrows={getArrows()}
      componentCTOToEdit={componentCTOToEdit}
      groups={groups}
      componentDatas={getCompDatas()}
      onClick={handleComponentClickEvent}
    />
  );
};

export interface Arrows {
  sourceComponentId: number;
  targetComponentId: number;
}

const useViewModel = () => {
  // ====== SELECTORS =====
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const groups: GroupTO[] = useSelector(masterDataSelectors.groups);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const dispatch = useDispatch();
  // ----- EDIT -----
  const componentCTOToEdit: ComponentCTO | null = useSelector(editSelectors.componentToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const conditionToEdit: ConditionTO | null = useSelector(editSelectors.conditionToEdit);
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
  // ----- VIEW -----
  const arrows: Arrows[] = useSelector(sequenceModelSelectors.selectCurrentArrows);
  const currentComponentDatas: ComponentData[] = useSelector(sequenceModelSelectors.selectComponentData);
  const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);
  const actions: ActionTO[] = useSelector(sequenceModelSelectors.selectActions);
  // const selectedStep: SequenceStepCTO | null = useSelector(sequenceModelSelectors.selectCurrentStep);
  // const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

  React.useEffect(() => {
    dispatch(MasterDataActions.loadComponentsFromBackend());
    dispatch(MasterDataActions.loadGroupsFromBackend());
  }, [dispatch]);

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(EditActions.component.save(componentCTO));
  };

  const getArrows = (): Arrows[] => {
    const allArrows: Arrows[] = [];
    arrows.forEach((arrow) => allArrows.push(arrow));
    if (stepToEdit) {
      allArrows.push({
        sourceComponentId: stepToEdit.squenceStepTO.sourceComponentFk,
        targetComponentId: stepToEdit.squenceStepTO.targetComponentFk,
      });
    }
    return allArrows;
  };

  const getCompDatas = () => {
    let compDatas: ViewFragmentProps[] = [];
    compDatas.push(...getComponentDatasFromView())
    compDatas.push(...getComponentDatasFromEdit())
    return compDatas;
  }

  const getComponentDatasFromView = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    const compDatasFromErros: ViewFragmentProps[] = errors.map(mapActionToComponentDatas);
    const compDatasFromActions: ViewFragmentProps[] = actions.map(mapActionToComponentDatas);
    const compDatasFromCompDatas: ViewFragmentProps[] = currentComponentDatas.map(mapComponentDataToCompoenntData);
    compDatas.push(...compDatasFromErros);
    compDatas.push(...(compDatasFromActions.filter(compDataFromAction => !compDatas.some(cp => compDataExists(cp, compDataFromAction)))));
    compDatas.push(...(compDatasFromCompDatas.filter(compDataFromCompData => !compDatas.some(cp => compDataExists(cp, compDataFromCompData)))));
    return compDatas;
  }

  const getComponentDatasFromEdit = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    const compDatasFromStepToEdit: ViewFragmentProps[] = stepToEdit?.actions.map(mapActionToComponentDatas) || [];
    const compDataFromActionToEdit: ViewFragmentProps | undefined = actionToEdit ? mapActionToComponentDatas(actionToEdit) : undefined;
    const compDataFromCondittionToEdit: ViewFragmentProps[] = mapConditionToCompData(conditionToEdit);
    const compDatasFromDataSetup: ViewFragmentProps[] = dataSetupToEdit ? dataSetupToEdit.initDatas.map(mapInitDataToCompData) : [];
    compDatas.push(...compDatasFromStepToEdit);
    compDatas.push(...compDataFromCondittionToEdit);
    compDatas.push(...compDatasFromDataSetup);
    if (compDataFromActionToEdit) {
      compDatas.push(compDataFromActionToEdit);
    }
    return compDatas;
  };

  const compDataExists = (propOne: ViewFragmentProps, propTwo: ViewFragmentProps) => {
    return propOne.partenId === propTwo.partenId && propOne.name === propTwo.name
  }

  function mapActionToComponentDatas(errorItem: ActionTO): ViewFragmentProps {
    const state: ViewFragmentState = mapActionTypeToViewFragmentState(errorItem.actionType);
    return { name: getDataNameById(errorItem.dataFk), state: state, partenId: errorItem.componentFk };
  }

  const mapComponentDataToCompoenntData = (compData: ComponentData): ViewFragmentProps => {
    return { name: getDataNameById(compData.dataFk), partenId: compData.componentFk, state: ViewFragmentState.PERSISTENT };
  }

  const mapConditionToCompData = (condition: ConditionTO | null): ViewFragmentProps[] => {
    let props: ViewFragmentProps[] = [];
    if (condition) {
      props = condition.dataFks.map((data) => {
        return {
          partenId: condition.componentFk,
          name: getDataNameById(data),
          state: condition.has ? ViewFragmentState.CHECKED : ViewFragmentState.DELETED,
        }
      })
    }
    return props;
  }

  const mapInitDataToCompData = (initData: InitDataTO): ViewFragmentProps => {
    return {
      partenId: initData.componentFk,
      name: getDataNameById(initData.dataFk),
      state: ViewFragmentState.NEW,
    }
  };

  const getDataNameById = (id: number): string => {
    return datas.find((data) => data.data.id === id)?.data.name || "Could not find Data";
  };

  const mapActionTypeToViewFragmentState = (actionType: ActionType): ViewFragmentState => {
    let cdState: ViewFragmentState;
    switch (actionType) {
      case ActionType.ADD:
        cdState = ViewFragmentState.NEW;
        break;
      case ActionType.DELETE:
        cdState = ViewFragmentState.DELETED;
        break;
      case ActionType.CHECK:
        cdState = ViewFragmentState.CHECKED;
        break;
    }
    return cdState;
  };

  return {
    components,
    componentCTOToEdit,
    getArrows,
    saveComp,
    groups,
    getCompDatas,
    handleComponentClickEvent: (componentId: number) => dispatch(SequenceModelActions.handleComponentClickEvent(componentId)),
  };
};
