import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { ActionType } from "../../../../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors, StepAction } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ActionTypeDropDown } from "../../../../../common/fragments/dropdowns/ActionTypeDropDown";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { DataDropDown } from "../../../../../common/fragments/dropdowns/DataDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditActionProps {}

export const ControllPanelEditAction: FunctionComponent<ControllPanelEditActionProps> = (props) => {
  const {
    label,
    setComponent,
    setAction,
    setData,
    saveAction,
    deleteAction,
    componentId,
    dataId,
    actionType,
  } = useControllPanelEditActionViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div className="optionFieldSpacer">
        <OptionField>
          <ComponentDropDown onSelect={setComponent} value={componentId} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          <ActionTypeDropDown onSelect={setAction} value={actionType} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField>
          <DataDropDown onSelect={setData} value={dataId} />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2ButtonLabel onClick={saveAction} label="OK" />
        <OptionField>
          <Carv2DeleteButton onClick={deleteAction} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditActionViewModel = () => {
  const stepActionToEdit: StepAction | null = useSelector(editSelectors.actionToEdit);
  const dispatch = useDispatch();

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(stepActionToEdit)) {
      handleError("Tried to go to edit action without actionToEdit specified");
      EditActions.setMode.edit();
    }
    // set step fk
    if (stepActionToEdit !== null) {
      const copyActionToEdit: StepAction = Carv2Util.deepCopy(stepActionToEdit);
      if (stepActionToEdit.actionTO.id === -1) {
        copyActionToEdit.actionTO.sequenceStepFk = stepActionToEdit.step.squenceStepTO.id;
      }
      dispatch(EditActions.action.update(copyActionToEdit.actionTO));
    }
    // used to focus the textfield on create another
  }, [dispatch, stepActionToEdit]);

  const saveAction = () => {
    if (!isNullOrUndefined(stepActionToEdit)) {
      const copyStepToEdit: StepAction = Carv2Util.deepCopy(stepActionToEdit);
      copyStepToEdit.step.actions.push(stepActionToEdit.actionTO);
      dispatch(EditActions.setMode.editStep(copyStepToEdit.step));
    }
  };

  const deleteAction = () => {
    if (!isNullOrUndefined(stepActionToEdit)) {
      const copyStepActionToEdit: StepAction = Carv2Util.deepCopy(stepActionToEdit);
      copyStepActionToEdit.step.actions.filter((action) => action.id !== stepActionToEdit.actionTO.id);
      dispatch(EditActions.action.delete(stepActionToEdit.actionTO));
      dispatch(EditActions.setMode.editStep(copyStepActionToEdit.step));
    }
  };

  const setComponent = (component: ComponentCTO | undefined): void => {
    if (!isNullOrUndefined(component)) {
      let copyStepActionToEdit: StepAction = Carv2Util.deepCopy(stepActionToEdit);
      copyStepActionToEdit.actionTO.componentFk = component.component.id;
      dispatch(EditActions.setMode.editAction(copyStepActionToEdit.actionTO));
    }
  };
  const setAction = (actionType: ActionType | undefined): void => {
    if (!isNullOrUndefined(actionType)) {
      let copyStepActionToEdit: StepAction = Carv2Util.deepCopy(stepActionToEdit);
      copyStepActionToEdit.actionTO.actionType = actionType;
      dispatch(EditActions.setMode.editAction(copyStepActionToEdit.actionTO));
    }
  };
  const setData = (data: DataCTO | undefined): void => {
    if (!isNullOrUndefined(data)) {
      let copyStepActionToEdit: StepAction = Carv2Util.deepCopy(stepActionToEdit);
      copyStepActionToEdit.actionTO.dataFk = data.data.id;
      dispatch(EditActions.setMode.editAction(copyStepActionToEdit.actionTO));
    }
  };

  const cancel = () => {
    if (stepActionToEdit) {
      dispatch(EditActions.setMode.editStep(stepActionToEdit.step));
    } else {
      dispatch(EditActions.setMode.edit());
    }
  };

  return {
    label: "EDIT ACTION",
    action: stepActionToEdit?.actionTO,
    cancel,
    setComponent,
    setAction,
    setData,
    saveAction,
    componentId: stepActionToEdit?.actionTO.componentFk === -1 ? undefined : stepActionToEdit?.actionTO.componentFk,
    dataId: stepActionToEdit?.actionTO.dataFk === -1 ? undefined : stepActionToEdit?.actionTO.dataFk,
    actionType: stepActionToEdit?.actionTO.actionType,
    deleteAction,
  };
};
