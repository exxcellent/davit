import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";

export interface ControllPanelEditDataInstanceProps {}

export const ControllPanelEditDataInstance: FunctionComponent<ControllPanelEditDataInstanceProps> = (props) => {
  const {
    label,
    textInput,
    changeName,
    name,
    saveDataInstace,
    updateData,
    deleteDataInstance,
  } = useControllPanelEditDataInstanceViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div />
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Data Instance Name"
        onChange={(event: any) => changeName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
        onBlur={() => updateData()}
      />
      <div className="columnDivider controllPanelEditChild">
        <Carv2ButtonLabel onClick={saveDataInstace} label="OK" />
      </div>
      <div className="columnDivider">
        <div className="controllPanelEditChild" style={{ display: "felx", alignItems: "center", height: "100%" }}>
          <Carv2DeleteButton onClick={deleteDataInstance} />
        </div>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataInstanceViewModel = () => {
  const dataToEdit: DataCTO | null = useSelector(editSelectors.dataToEdit);
  const instanceId: number | null = useSelector(editSelectors.instanceIndexToEdit);
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
    if (!isNullOrUndefined(instanceId)) {
      let copyDataToEdit: DataCTO = Carv2Util.deepCopy(dataToEdit);
      // TODO: validate name so every instance name is unic.
      copyDataToEdit.data.inst.find((instance) => instance.id === instanceId)!.name = name;
      dispatch(EditActions.data.update(copyDataToEdit));
    }
  };

  const updateData = () => {
    if (!isNullOrUndefined(dataToEdit)) {
      let copyDataToEdit: DataCTO = Carv2Util.deepCopy(dataToEdit);
      dispatch(EditActions.data.save(copyDataToEdit));
    }
  };

  const saveDataInstace = () => {
    if (!isNullOrUndefined(dataToEdit)) {
      dispatch(EditActions.data.save(dataToEdit!));
      dispatch(EditActions.setMode.editData(dataToEdit!));
    }
  };

  const deleteDataInstance = () => {
    if (!isNullOrUndefined(dataToEdit) && !isNullOrUndefined(instanceId)) {
      let copyDataToEdit: DataCTO = Carv2Util.deepCopy(dataToEdit);
      copyDataToEdit.data.inst.splice(instanceId, 1);
      dispatch(EditActions.data.save(copyDataToEdit));
      dispatch(EditActions.setMode.editData(copyDataToEdit));
    }
  };

  const getName = (): string => {
    let name: string = "";
    if (!isNullOrUndefined(dataToEdit) && !isNullOrUndefined(instanceId)) {
      name = dataToEdit.data.inst.find((instance) => instance.id === instanceId)?.name || "";
    }
    return name;
  };

  return {
    label: dataToEdit?.data.id === -1 ? "ADD DATA INSTANCE" : "EDIT DATA INSTANCE",
    name: getName(),
    changeName,
    saveDataInstace,
    textInput,
    updateData,
    deleteDataInstance,
    instances: dataToEdit?.data.inst ? dataToEdit.data.inst : [],
  };
};
