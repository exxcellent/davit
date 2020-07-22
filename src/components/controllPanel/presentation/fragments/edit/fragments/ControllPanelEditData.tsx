import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { DataInstanceDropDownButton } from "../../../../../common/fragments/dropdowns/DataInstanceDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";

export interface ControllPanelEditDataProps { }

export const ControllPanelEditData: FunctionComponent<ControllPanelEditDataProps> = (props) => {
  const {
    label,
    textInput,
    changeName,
    deleteData,
    name,
    saveData,
    updateData,
    createAnother,
    instances,
    editOrAddInstance,
  } = useControllPanelEditDataViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Data Name"
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
        onBlur={() => updateData()}
      />
      <div className="columnDivider controllPanelEditChild">
        <Button.Group>
          <Button icon="add" inverted color="orange" onClick={() => editOrAddInstance()} />
          <Button id="buttonGroupLabel" disabled inverted color="orange">
            Data Instance
          </Button>
          <DataInstanceDropDownButton onSelect={editOrAddInstance} icon={"wrench"} instances={instances} />
        </Button.Group>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2ButtonLabel onClick={createAnother} label="Create another" />
        <Carv2ButtonLabel onClick={saveData} label="OK" />
      </div>
      <div className="columnDivider">
        <div className="controllPanelEditChild" style={{ display: "felx", alignItems: "center", height: "100%" }}>
          <Carv2DeleteButton onClick={deleteData} />
        </div>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataViewModel = () => {
  const dataToEdit: DataCTO | null = useSelector(editSelectors.dataToEdit);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dataToEdit]);

  useEffect(() => {
    // check if component to edit is really set or gso back to edit mode
    if (isNullOrUndefined(dataToEdit)) {
      handleError("Tried to go to edit data without dataToedit specified");
      dispatch(EditActions.setMode.edit());
    }
  });

  const changeName = (name: string) => {
    let copyDataToEdit: DataCTO = Carv2Util.deepCopy(dataToEdit);
    copyDataToEdit.data.name = name;
    dispatch(EditActions.setMode.editData(copyDataToEdit));
  };

  const updateData = () => {
    let copyDataToEdit: DataCTO = Carv2Util.deepCopy(dataToEdit);
    dispatch(EditActions.data.save(copyDataToEdit));
  };

  const saveData = () => {
    dispatch(EditActions.data.save(dataToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const deleteData = () => {
    dispatch(EditActions.data.delete(dataToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const createAnother = () => {
    dispatch(EditActions.setMode.editData());
  };

  const editOrAddInstance = (id?: number) => {
    if (!isNullOrUndefined(dataToEdit)) {
      dispatch(EditActions.setMode.editDataInstance(Carv2Util.deepCopy(dataToEdit), id));
    }
  };

  return {
    label: dataToEdit?.data.id === -1 ? "ADD DATA" : "EDIT DATA",
    name: dataToEdit?.data.name,
    changeName,
    saveData,
    deleteData,
    textInput,
    updateData,
    createAnother,
    instances: dataToEdit?.data.inst ? dataToEdit.data.inst : [],
    editOrAddInstance,
  };
};
