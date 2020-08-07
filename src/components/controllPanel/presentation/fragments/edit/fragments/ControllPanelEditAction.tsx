import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { ActionTO } from "../../../../../../dataAccess/access/to/ActionTO";
import { DataInstanceTO, DATA_INSTANCE_ID_FACTOR } from "../../../../../../dataAccess/access/to/DataTO";
import { ActionType } from "../../../../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ActionTypeDropDown } from "../../../../../common/fragments/dropdowns/ActionTypeDropDown";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { DataAndInstanceDropDown } from "../../../../../common/fragments/dropdowns/DataAndInstanceDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditActionProps {}

export const ControllPanelEditAction: FunctionComponent<ControllPanelEditActionProps> = (props) => {
  const {
    label,
    setComponent,
    setAction,
    setData,
    deleteAction,
    componentId,
    dataId,
    actionType,
    backToStep,
    createAnother,
    key,
  } = useControllPanelEditActionViewModel();

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="optionFieldSpacer">
        <OptionField label1="Select Component on which the action will be called">
          <ComponentDropDown onSelect={setComponent} value={componentId} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label1="Select action to execute">
          <ActionTypeDropDown onSelect={setAction} value={actionType} />
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label1="Select a Data for the action">
          <DataAndInstanceDropDown onSelect={setData} value={dataId} />
        </OptionField>
      </div>

      <div className="columnDivider controllPanelEditChild">
        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <OptionField label1="Navigation">
            <Carv2ButtonLabel onClick={createAnother} label="Create another" />
            <Carv2ButtonIcon onClick={backToStep} icon="reply" />
          </OptionField>
        </div>
        <OptionField label1="Sequence - Options">
          <Carv2DeleteButton onClick={deleteAction} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditActionViewModel = () => {
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const dispatch = useDispatch();

  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(actionToEdit)) {
      dispatch(handleError("Tried to go to edit action without actionToEdit specified"));
      dispatch(EditActions.setMode.edit());
    }
    // used to focus the textfield on create another
  }, [dispatch, actionToEdit]);

  const deleteAction = () => {
    if (!isNullOrUndefined(actionToEdit)) {
      dispatch(EditActions.action.delete(actionToEdit));
      dispatch(EditActions.setMode.editStep(EditActions.step.find(actionToEdit.sequenceStepFk)));
    }
  };

  const setComponent = (component: ComponentCTO | undefined): void => {
    if (!isNullOrUndefined(component)) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.componentFk = component.component.id;
      dispatch(EditActions.action.update(copyActionToEdit));
      dispatch(EditActions.action.save(copyActionToEdit));
    }
  };

  const setAction = (actionType: ActionType | undefined): void => {
    if (!isNullOrUndefined(actionType)) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      copyActionToEdit.actionType = actionType;
      dispatch(EditActions.action.update(copyActionToEdit));
      dispatch(EditActions.action.save(copyActionToEdit));
    }
  };

  const setData = (values: { data?: DataCTO; instance?: DataInstanceTO } | undefined): void => {
    if (!isNullOrUndefined(values?.data)) {
      let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
      if (values?.instance) {
        copyActionToEdit.dataFk = values.data.data.id * DATA_INSTANCE_ID_FACTOR + values.instance.id;
      } else {
        copyActionToEdit.dataFk = values!.data.data.id;
      }
      dispatch(EditActions.action.update(copyActionToEdit));
      dispatch(EditActions.action.save(copyActionToEdit));
    }
  };

  const backToStep = () => {
    if (!isNullOrUndefined(actionToEdit)) {
      dispatch(EditActions.setMode.editStep(EditActions.step.find(actionToEdit.sequenceStepFk)));
    }
  };

  const createAnother = () => {
    if (actionToEdit) {
      let newAction: ActionTO = new ActionTO();
      newAction.sequenceStepFk = actionToEdit.sequenceStepFk;
      dispatch(EditActions.action.create(newAction));
      setKey(key + 1);
    }
  };

  return {
    label: "EDIT SEQUENCE - EDIT STEP - EDIT ACTION",
    action: actionToEdit,
    setComponent,
    setAction,
    setData,
    componentId: actionToEdit?.componentFk === -1 ? undefined : actionToEdit?.componentFk,
    dataId: actionToEdit?.dataFk === -1 ? undefined : actionToEdit?.dataFk,
    actionType: actionToEdit?.actionType,
    deleteAction,
    backToStep,
    createAnother,
    key,
  };
};
