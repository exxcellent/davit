import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditChainLinkProps {}

export const ControllPanelEditChainLink: FunctionComponent<ControllPanelEditChainLinkProps> = (props) => {
  const { label, key } = useControllPanelEditChainLinkViewModel();

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="optionFieldSpacer">
        <OptionField label="Select Component on which the action will be called">
          {/* <ComponentDropDown onSelect={setComponent} value={componentId} /> */}
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="Select action to execute">
          {/* <ActionTypeDropDown onSelect={setAction} value={actionType} /> */}
        </OptionField>
      </div>
      <div className="optionFieldSpacer columnDivider">
        <OptionField label="Select data affected by the action">
          {/* <DataAndInstanceDropDown onSelect={setData} value={dataId} /> */}
        </OptionField>
      </div>

      <div className="columnDivider controllPanelEditChild">
        <div className="innerOptionFieldSpacer">
          <OptionField label="Navigation">
            <Carv2ButtonLabel onClick={() => {}} label="Create another" />
            <Carv2ButtonIcon onClick={() => {}} icon="reply" />
          </OptionField>
        </div>
        <OptionField label="Sequence - Options">
          <Carv2DeleteButton onClick={() => {}} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditChainLinkViewModel = () => {
  // const chainLinkToEdit: ChainlinkTO | null = useSelector(editSelectors.chainLinkToEdit);
  const dispatch = useDispatch();

  const [key, setKey] = useState<number>(0);

  // useEffect(() => {
  //   // check if component to edit is really set or gos back to edit mode
  //   if (isNullOrUndefined(actionToEdit)) {
  //     dispatch(handleError("Tried to go to edit action without actionToEdit specified"));
  //     dispatch(EditActions.setMode.edit());
  //   }
  //   // used to focus the textfield on create another
  // }, [dispatch, actionToEdit]);

  // const deleteAction = () => {
  //   if (!isNullOrUndefined(actionToEdit)) {
  //     dispatch(EditActions.action.delete(actionToEdit));
  //     dispatch(EditActions.setMode.editStep(EditActions.step.find(actionToEdit.sequenceStepFk)));
  //   }
  // };

  // const setComponent = (component: ComponentCTO | undefined): void => {
  //   if (!isNullOrUndefined(component)) {
  //     let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
  //     copyActionToEdit.componentFk = component.component.id;
  //     dispatch(EditActions.action.update(copyActionToEdit));
  //     dispatch(EditActions.action.save(copyActionToEdit));
  //   }
  // };

  // const setAction = (actionType: ActionType | undefined): void => {
  //   if (!isNullOrUndefined(actionType)) {
  //     let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
  //     copyActionToEdit.actionType = actionType;
  //     dispatch(EditActions.action.update(copyActionToEdit));
  //     dispatch(EditActions.action.save(copyActionToEdit));
  //   }
  // };

  // const setData = (values: { data?: DataCTO; instance?: DataInstanceTO } | undefined): void => {
  //   if (!isNullOrUndefined(values?.data)) {
  //     let copyActionToEdit: ActionTO = Carv2Util.deepCopy(actionToEdit);
  //     if (values?.instance) {
  //       copyActionToEdit.dataFk = values.data.data.id * DATA_INSTANCE_ID_FACTOR + values.instance.id;
  //     } else {
  //       copyActionToEdit.dataFk = values!.data.data.id;
  //     }
  //     dispatch(EditActions.action.update(copyActionToEdit));
  //     dispatch(EditActions.action.save(copyActionToEdit));
  //   }
  // };

  // const backToStep = () => {
  //   if (!isNullOrUndefined(actionToEdit)) {
  //     dispatch(EditActions.setMode.editStep(EditActions.step.find(actionToEdit.sequenceStepFk)));
  //   }
  // };

  // const createAnother = () => {
  //   if (actionToEdit) {
  //     let newAction: ActionTO = new ActionTO();
  //     newAction.sequenceStepFk = actionToEdit.sequenceStepFk;
  //     dispatch(EditActions.action.create(newAction));
  //     setKey(key + 1);
  //   }
  // };

  return {
    label: "EDIT * CHAIN * STEP * LINK",
    key,
  };
};
