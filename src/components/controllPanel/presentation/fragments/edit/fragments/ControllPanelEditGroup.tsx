import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { GroupTO } from "../../../../../../dataAccess/access/to/GroupTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ColorDropDown } from "../../../../../common/fragments/dropdowns/ColorDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";

export interface ControllPanelEditGroupProps {}

export const ControllPanelEditGroup: FunctionComponent<ControllPanelEditGroupProps> = (props) => {
  const {
    label,
    name,
    textInput,
    changeName,
    saveGroup,
    deleteGroup,
    getGroupColor,
    setGroupColor,
    createAnother,
    updateGroup,
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
          onBlur={() => updateGroup()}
        />
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2ButtonLabel onClick={createAnother} label="Create another" />
        <Carv2ButtonLabel onClick={saveGroup} label="OK" />
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2DeleteButton onClick={deleteGroup} />
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditGroupViewModel = () => {
  const groupToEdit: GroupTO | null = useSelector(editSelectors.groupToEdit);
  const dispatch = useDispatch();
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

  const updateGroup = () => {
    let copyGroup: GroupTO = Carv2Util.deepCopy(groupToEdit);
    dispatch(EditActions.group.save(copyGroup));
  };

  const saveGroup = () => {
    dispatch(EditActions.group.save(groupToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const deleteGroup = () => {
    dispatch(EditActions.group.delete(groupToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const createAnother = () => {
    dispatch(EditActions.setMode.editGroup());
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
    label: "EDIT GROUP",
    name: groupToEdit?.name,
    changeName,
    saveGroup,
    deleteGroup,
    textInput,
    getGroupColor,
    setGroupColor,
    createAnother,
    updateGroup,
  };
};
