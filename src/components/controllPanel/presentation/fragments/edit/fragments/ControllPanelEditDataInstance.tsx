import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataInstanceTO } from "../../../../../../dataAccess/access/to/DataInstanceTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditDataInstanceProps {
  hidden: boolean;
}

export const ControllPanelEditDataInstance: FunctionComponent<ControllPanelEditDataInstanceProps> = (props) => {
  const { hidden } = props;
  const {
    label,
    textInput,
    changeName,
    name,
    saveDataInstace,
    updateData,
    deleteDataInstance,
    createAnother,
    id,
  } = useControllPanelEditDataInstanceViewModel();

  return (
    <ControllPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveDataInstace}>
      <div className="optionFieldSpacer">
        <OptionField label="Instance - Name">
          <Carv2LabelTextfield
            label="Name:"
            placeholder="Data Instance Name"
            onChange={(event: any) => changeName(event.target.value)}
            value={name}
            autoFocus
            ref={textInput}
            onBlur={() => updateData()}
            unvisible={hidden}
          />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild"></div>
      <div className="columnDivider controllPanelEditChild">
        <div>
          <OptionField label="Navigation">
            <Carv2ButtonLabel onClick={createAnother} label="Create another" />
            <Carv2ButtonIcon onClick={saveDataInstace} icon="reply" />
          </OptionField>
        </div>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Data - Options">
          <Carv2DeleteButton onClick={deleteDataInstance} />
        </OptionField>
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
    // check if component to edit is really set or go back to edit mode
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
      const instance: DataInstanceTO | undefined = copyDataToEdit.data.inst.find(
        (instance) => instance.id === instanceId
      );
      if (instance) {
        if (instance.name !== "") {
          dispatch(EditActions.data.save(copyDataToEdit));
        }
      }
    }
  };

  const saveDataInstace = (newMode?: string) => {
    if (!isNullOrUndefined(dataToEdit)) {
      const instance: DataInstanceTO | undefined = dataToEdit.data.inst.find((instance) => instance.id === instanceId);
      if (instance) {
        if (instance.name !== "") {
          dispatch(EditActions.data.save(dataToEdit!));
        } else {
          deleteDataInstance();
        }
        if (newMode && newMode === "EDIT") {
          dispatch(EditActions.setMode.edit());
        } else {
          dispatch(EditActions.setMode.editData(dataToEdit!));
        }
      }
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

  const createAnother = () => {
    if (!isNullOrUndefined(dataToEdit)) {
      dispatch(EditActions.setMode.editDataInstance(Carv2Util.deepCopy(dataToEdit), undefined));
    }
  };

  return {
    label: "EDIT * DATA * INSTANCE",
    name: getName(),
    changeName,
    saveDataInstace,
    textInput,
    updateData,
    deleteDataInstance,
    createAnother,
    instances: dataToEdit?.data.inst ? dataToEdit.data.inst : [],
    id: (dataToEdit?.data.id || -1) + (instanceId || -1),
  };
};
