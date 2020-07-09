import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../dataAccess/access/to/ActionTO";
import { ConditionTO } from "../../../dataAccess/access/to/ConditionTO";
import { GroupTO } from "../../../dataAccess/access/to/GroupTO";
import { ActionType } from "../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors, Mode } from "../../../slices/EditSlice";
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

const useViewModel = () => {
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const groups: GroupTO[] = useSelector(masterDataSelectors.groups);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const mode: Mode = useSelector(editSelectors.mode);
  const dispatch = useDispatch();
  // ====== SELECTORS =====
  // ----- EDIT -----
  const componentCTOToEdit: ComponentCTO | null = useSelector(editSelectors.componentToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const conditionToEdit: ConditionTO | null = useSelector(editSelectors.conditionToEdit);
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
  // ----- VIEW -----
  const selectedStep: SequenceStepCTO | null = useSelector(sequenceModelSelectors.selectCurrentStep);
  const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

  React.useEffect(() => {
    dispatch(MasterDataActions.loadComponentsFromBackend());
    dispatch(MasterDataActions.loadGroupsFromBackend());
  }, [dispatch]);

  const saveComp = (componentCTO: ComponentCTO) => {
    dispatch(EditActions.component.save(componentCTO));
  };

  const getArrows = (): { sourceCompId: number; targetCompId: number }[] => {
    let arrows: { sourceCompId: number; targetCompId: number }[] = [];
    if (mode.startsWith("EDIT") && !isNullOrUndefined(stepToEdit)) {
      arrows.push({
        sourceCompId: stepToEdit.squenceStepTO.sourceComponentFk,
        targetCompId: stepToEdit.squenceStepTO.targetComponentFk,
      });
    }
    if (mode.startsWith("VIEW") && !isNullOrUndefined(selectedStep)) {
      arrows.push({
        sourceCompId: selectedStep.squenceStepTO.sourceComponentFk,
        targetCompId: selectedStep.squenceStepTO.targetComponentFk,
      });
    }
    return arrows;
  };

  const getComponentDatas = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    switch (mode) {
      case Mode.EDIT_SEQUENCE_STEP:
        stepToEdit?.actions.forEach((action) =>
          compDatas.push({
            partenId: action.componentFk,
            name: getDataNameById(action.dataFk),
            state: mapActionTypeToViewFragmentState(action.actionType),
          })
        );
        break;
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        if (!isNullOrUndefined(actionToEdit)) {
          compDatas.push({
            partenId: actionToEdit.componentFk,
            name: getDataNameById(actionToEdit.dataFk),
            state: mapActionTypeToViewFragmentState(actionToEdit.actionType),
          });
        }
        break;
      case Mode.EDIT_SEQUENCE_CONDITION:
        if (!isNullOrUndefined(conditionToEdit)) {
          conditionToEdit.dataFks.forEach((data) =>
            compDatas.push({
              partenId: conditionToEdit.componentFk,
              name: getDataNameById(data),
              state: conditionToEdit.condition ? ViewFragmentState.CHECKED : ViewFragmentState.DELETED,
            })
          );
        }
        break;
      case Mode.EDIT_DATA_SETUP:
        if (!isNullOrUndefined(dataSetupToEdit)) {
          dataSetupToEdit.initDatas.forEach((initData) =>
            compDatas.push({
              partenId: initData.componentFk,
              name: getDataNameById(initData.dataFk),
              state: ViewFragmentState.NEW,
            })
          );
        }
        break;
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
