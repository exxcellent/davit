import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../dataAccess/access/to/ActionTO";
import { ConditionTO } from "../../../dataAccess/access/to/ConditionTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { ActionType } from "../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors } from "../../../slices/EditSlice";
import { MasterDataActions, masterDataSelectors } from "../../../slices/MasterDataSlice";
import { sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { ViewFragmentProps } from "../../../viewDataTypes/ViewFragment";
import { ViewFragmentState } from "../../../viewDataTypes/ViewFragmentState";
import { MetaComponentDnDBox } from "./fragments/MetaComponentDnDBox";

interface MetaComponentModelControllerProps {}

export const MetaComponentModelController: FunctionComponent<MetaComponentModelControllerProps> = (props) => {
  const { components, getArrows, saveComp, groups, getComponentDatas, componentCTOToEdit } = useViewModel();

  return (
    <MetaComponentDnDBox
      componentCTOs={components}
      onSaveCallBack={saveComp}
      arrows={getArrows()}
      componentCTOToEdit={componentCTOToEdit}
      groups={groups}
      componentDatas={getComponentDatas()}
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

  const getComponentDatas = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    stepToEdit?.actions.forEach((action) =>
      compDatas.push({
        partenId: action.componentFk,
        name: getDataNameById(action.dataFk),
        state: mapActionTypeToViewFragmentState(action.actionType),
      })
    );
    if (!isNullOrUndefined(actionToEdit)) {
      compDatas.push({
        partenId: actionToEdit.componentFk,
        name: getDataNameById(actionToEdit.dataFk),
        state: mapActionTypeToViewFragmentState(actionToEdit.actionType),
      });
    }
    if (!isNullOrUndefined(conditionToEdit)) {
      conditionToEdit.dataFks.forEach((data) =>
        compDatas.push({
          partenId: conditionToEdit.componentFk,
          name: getDataNameById(data),
          state: conditionToEdit.has ? ViewFragmentState.CHECKED : ViewFragmentState.DELETED,
        })
      );
    }
    if (!isNullOrUndefined(dataSetupToEdit)) {
      dataSetupToEdit.initDatas.forEach((initData) =>
        compDatas.push({
          partenId: initData.componentFk,
          name: getDataNameById(initData.dataFk),
          state: ViewFragmentState.NEW,
        })
      );
    }
    return compDatas;
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
    getComponentDatas,
  };
};
