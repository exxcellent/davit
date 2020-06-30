import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../../../../dataAccess/access/to/ActionTO";
import { ActionType } from "../../../../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ActionTypeDropDown } from "../../../../../common/fragments/dropdowns/ActionTypeDropDown";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { DataDropDown } from "../../../../../common/fragments/dropdowns/DataDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2SubmitCancel } from "../common/fragments/Carv2SubmitCancel";
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
    showDelete,
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
        <Carv2SubmitCancel onSubmit={saveAction} onCancel={cancel} />
        {showDelete && <Carv2DeleteButton onClick={deleteAction} />}
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditActionViewModel = () => {
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const dispatch = useDispatch();

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(actionToEdit)) {
      handleError("Tried to go to edit action without actionToEdit specified");
      EditActions.setMode.edit();
    }
    // used to focus the textfield on create another
  }, [actionToEdit]);

  const saveAction = () => {
    if (!isNullOrUndefined(actionToEdit) && !isNullOrUndefined(stepToEdit)) {
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      copyStepToEdit.actions.push(actionToEdit);
      dispatch(EditActions.setMode.editStep(copyStepToEdit));
    }
  };

  const deleteAction = () => {
    if (!isNullOrUndefined(actionToEdit) && !isNullOrUndefined(stepToEdit)) {
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);
      copyStepToEdit.actions.filter((action) => action.id !== actionToEdit.id);
      dispatch(EditActions.action.delete(actionToEdit));
      dispatch(EditActions.setMode.editStep(copyStepToEdit));
    }
  };

  const setComponent = (component: ComponentCTO | undefined): void => {
    if (!isNullOrUndefined(component) && !isNullOrUndefined(actionToEdit)) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.componentFk = component.component.id;
      dispatch(EditActions.setMode.editAction(copyActionToEdit));
    }
  };
  const setAction = (actionType: ActionType | undefined): void => {
    if (!isNullOrUndefined(actionType) && !isNullOrUndefined(actionToEdit)) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.actionType = actionType;
      dispatch(EditActions.setMode.editAction(copyActionToEdit));
    }
  };
  const setData = (data: DataCTO | undefined): void => {
    if (!isNullOrUndefined(data) && !isNullOrUndefined(actionToEdit)) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.dataFk = data.data.id;
      dispatch(EditActions.setMode.editAction(copyActionToEdit));
    }
  };

  const cancel = () => {
    if (stepToEdit) {
      dispatch(EditActions.setMode.editStep(stepToEdit));
    } else {
      dispatch(EditActions.setMode.edit());
    }
  };

  return {
    label: actionToEdit?.id === -1 ? "ADD ACTION" : "EDIT ACTION",
    action: actionToEdit,
    cancel,
    setComponent,
    setAction,
    setData,
    saveAction,
    componentId: actionToEdit?.componentFk === -1 ? undefined : actionToEdit?.componentFk,
    dataId: actionToEdit?.dataFk === -1 ? undefined : actionToEdit?.dataFk,
    actionType: actionToEdit?.actionType,
    showDelete: actionToEdit?.id !== -1 ? true : false,
    deleteAction,
  };
};
