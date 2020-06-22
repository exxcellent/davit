import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ActionCTO } from "../../../../../../dataAccess/access/cto/ActionCTO";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionType } from "../../../../../../dataAccess/access/types/ActionType";
import { GlobalActions, handleError } from "../../../../../../slices/GlobalSlice";
import {
  currentActionToEdit,
  currentStep,
  SequenceActions,
  SequenceSlice,
} from "../../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2SubmitCancel } from "../common/fragments/Carv2SubmitCancel";
import { ActionTypeDropDown } from "../common/fragments/dropdowns/ActionTypeDropDown";
import { ComponentDropDown } from "../common/fragments/dropdowns/ComponentDropDown";
import { DataDropDown } from "../common/fragments/dropdowns/DataDropDown";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditActionProps {}

export const ControllPanelEditAction: FunctionComponent<ControllPanelEditActionProps> = (props) => {
  const {
    label,
    cancel,
    setComponent,
    setAction,
    setData,
    saveAction,
    selectComponentPlaceholder,
    selectActionTypePlaceholder,
    selectDataPlaceholder,
  } = useControllPanelEditActionViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div className="optionFieldSpacer">
        <OptionField>
          <ComponentDropDown onSelect={setComponent} placeholder={selectComponentPlaceholder} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          <ActionTypeDropDown onSelect={setAction} placeholder={selectActionTypePlaceholder as string} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          <DataDropDown onSelect={setData} placeholder={selectDataPlaceholder} />
        </OptionField>
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancel onSubmit={saveAction} onCancel={cancel} onChange={() => {}} />
        <div className="controllPanelEditChild" style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Carv2DeleteButton onClick={() => {}} />
        </div>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditActionViewModel = () => {
  const actionToEdit: ActionCTO | null = useSelector(currentActionToEdit);
  console.info("action to edit: ", actionToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(currentStep);
  const dispatch = useDispatch();
  //   const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(actionToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit action without actionToEdit specified");
    }
    // used to focus the textfield on create another
  }, [actionToEdit]);

  const saveAction = () => {
    if (!isNullOrUndefined(actionToEdit) && !isNullOrUndefined(stepToEdit)) {
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      copyStepToEdit.actions.push(actionToEdit);
      dispatch(SequenceActions.updateCurrentSequenceStep(copyStepToEdit));
      dispatch(GlobalActions.setModeToEditStep(stepToEdit.squenceStepTO.index));
    }
  };

  const setComponent = (component: ComponentCTO | undefined): void => {
    if (!isNullOrUndefined(component) && !isNullOrUndefined(actionToEdit)) {
      let copyActionToEdit: ActionCTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.componentTO = component.component;
      copyActionToEdit.actionTO.componentFk = component.component.id;
      dispatch(SequenceSlice.actions.setCurrentActionToEdit(copyActionToEdit));
    }
  };
  const setAction = (actionType: ActionType | undefined): void => {
    if (!isNullOrUndefined(actionType) && !isNullOrUndefined(actionToEdit)) {
      let copyActionToEdit: ActionCTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.actionTO.actionType = actionType;
      dispatch(SequenceSlice.actions.setCurrentActionToEdit(copyActionToEdit));
    }
  };
  const setData = (data: DataCTO | undefined): void => {
    if (!isNullOrUndefined(data) && !isNullOrUndefined(actionToEdit)) {
      let copyActionToEdit: ActionCTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.dataTO = data.data;
      copyActionToEdit.actionTO.dataFk = data.data.id;
      dispatch(SequenceSlice.actions.setCurrentActionToEdit(copyActionToEdit));
    }
  };

  return {
    label: actionToEdit?.actionTO.id === -1 ? "ADD ACTION" : "EDIT ACTION",
    component: actionToEdit?.componentTO,
    action: actionToEdit?.actionTO,
    data: actionToEdit?.dataTO,
    cancel: () => dispatch(GlobalActions.setModeToEditStep(stepToEdit?.squenceStepTO.index)),
    setComponent,
    setAction,
    setData,
    saveAction,
    selectComponentPlaceholder:
      actionToEdit?.componentTO.name === "" ? "Select Component..." : actionToEdit?.componentTO.name,
    selectActionTypePlaceholder: actionToEdit?.actionTO.actionType,
    selectDataPlaceholder: actionToEdit?.dataTO.name === "" ? "Select Data..." : actionToEdit?.dataTO.name,
  };
};
