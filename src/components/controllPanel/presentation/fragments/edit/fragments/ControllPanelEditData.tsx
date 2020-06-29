import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataActions, selectCurrentData } from "../../../../../../slices/DataSlice";
import { EditActions } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancelCheckBox } from "../common/fragments/Carv2SubmitCancel";

export interface ControllPanelEditDataProps {}

export const ControllPanelEditData: FunctionComponent<ControllPanelEditDataProps> = (props) => {
  const {
    label,
    textInput,
    cancel,
    changeName,
    deleteData,
    name,
    saveData,
    showDelete,
    toggleIsCreateAnother,
    validName,
  } = useControllPanelEditDataViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div />
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Data Name"
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
      />
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancelCheckBox
          onSubmit={saveData}
          onCancel={cancel}
          onChange={toggleIsCreateAnother}
          submitCondition={validName()}
        />
      </div>
      {showDelete && (
        <div className="columnDivider">
          <div className="controllPanelEditChild" style={{ display: "felx", alignItems: "center", height: "100%" }}>
            <Carv2DeleteButton onClick={deleteData} />
          </div>
        </div>
      )}
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataViewModel = () => {
  const dataToEdit: DataCTO | null = useSelector(selectCurrentData);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
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
    dispatch(DataActions.setDataToEdit(copyDataToEdit));
  };

  const saveData = () => {
    dispatch(DataActions.saveData(dataToEdit!));
    if (isCreateAnother) {
      dispatch(EditActions.setMode.editData());
    } else {
      dispatch(EditActions.setMode.edit());
    }
  };

  const deleteData = () => {
    dispatch(DataActions.deleteData(dataToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const validName = (): boolean => {
    if (!isNullOrUndefined(dataToEdit)) {
      return Carv2Util.isValidName(dataToEdit.data.name);
    }
    return false;
  };

  return {
    label: dataToEdit?.data.id === -1 ? "ADD DATA" : "EDIT DATA",
    name: dataToEdit?.data.name,
    changeName,
    saveData,
    deleteData,
    cancel: () => dispatch(EditActions.setMode.edit()),
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    textInput,
    showDelete: dataToEdit?.data.id !== -1,
    validName,
  };
};
