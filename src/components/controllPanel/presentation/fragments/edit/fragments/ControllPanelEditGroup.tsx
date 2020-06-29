import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { GroupTO } from "../../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ColorDropDown } from "../../../../../common/fragments/dropdowns/ColorDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel, Carv2SubmitCancelCheckBox } from "../common/fragments/Carv2SubmitCancel";

export interface ControllPanelEditGroupProps {}

export const ControllPanelEditGroup: FunctionComponent<ControllPanelEditGroupProps> = (props) => {
  const {
    label,
    name,
    textInput,
    changeName,
    saveGroup,
    cancelEditGroup,
    deleteGroup,
    showExistingOptions,
    toggleIsCreateAnother,
    validateInput,
    getGroupColor,
    setGroupColor,
  } = useControllPanelEditGroupViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div className="controllPanelEditChild">
        <ColorDropDown onSelect={setGroupColor} placeholder={getGroupColor()} colors={["red", "blue", "green"]} />
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2LabelTextfield
          label="Name:"
          placeholder="Group Name ..."
          onChange={(event: any) => changeName(event.target.value)}
          value={name}
          autoFocus
          ref={textInput}
        />
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        {!showExistingOptions && (
          <Carv2SubmitCancelCheckBox
            onSubmit={saveGroup}
            onCancel={cancelEditGroup}
            onChange={toggleIsCreateAnother}
            submitCondition={validateInput()}
          />
        )}
        {showExistingOptions && (
          <Carv2SubmitCancel onSubmit={saveGroup} onCancel={cancelEditGroup} submitCondition={validateInput()} />
        )}
      </div>
      {showExistingOptions && (
        <div className="columnDivider controllPanelEditChild">
          <Carv2DeleteButton onClick={deleteGroup} />
        </div>
      )}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditGroupViewModel = () => {
  //   const sequenceToEdit: SequenceCTO | null = useSelector(currentSequence);
  const groupToEdit: GroupTO | null = useSelector(editSelectors.groupToEdit);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (isNullOrUndefined(groupToEdit)) {
      handleError("Tried to go to edit group without groupToEdit specified");
      dispatch(EditActions.setMode.edit());
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [groupToEdit, dispatch]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(groupToEdit)) {
      let copyGroupToEdit: GroupTO = Carv2Util.deepCopy(groupToEdit);
      copyGroupToEdit.name = name;
      dispatch(EditActions.setMode.editGroup(copyGroupToEdit));
    }
  };

  const saveGroup = () => {
    dispatch(EditActions.group.save(groupToEdit!));
    if (isCreateAnother) {
      dispatch(EditActions.setMode.editGroup());
    } else {
      dispatch(EditActions.setMode.edit());
    }
  };

  const deleteGroup = () => {
    dispatch(EditActions.group.delete(groupToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const cancelEditGroup = () => {
    dispatch(EditActions.setMode.edit());
  };

  const validateInput = (): boolean => {
    if (!isNullOrUndefined(groupToEdit)) {
      return Carv2Util.isValidName(groupToEdit.name);
    } else {
      return false;
    }
  };

  const getGroupColor = (): string => {
    if (!isNullOrUndefined(groupToEdit)) {
      return groupToEdit.color;
    } else {
      return "";
    }
  };

  const setGroupColor = (color: string | undefined) => {
    if (!isNullOrUndefined(groupToEdit)) {
      let copyGroupToEdit: GroupTO = Carv2Util.deepCopy(groupToEdit);
      if (color !== undefined) {
        copyGroupToEdit.color = color;
      }
      dispatch(EditActions.setMode.editGroup(copyGroupToEdit));
    }
  };

  return {
    label: groupToEdit?.id === -1 ? "ADD GROUP" : "EDIT GROUP",
    name: groupToEdit?.name,
    changeName,
    saveGroup,
    deleteGroup,
    cancelEditGroup,
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    textInput,
    showExistingOptions: groupToEdit?.id !== -1,
    validateInput,
    getGroupColor,
    setGroupColor,
  };
};
