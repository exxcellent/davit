import React, { FunctionComponent, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataInstanceTO } from "../../../../../../dataAccess/access/to/DataInstanceTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { masterDataSelectors } from "../../../../../../slices/MasterDataSlice";
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
    deleteDataInstance,
    createAnother,
    key,
  } = useControllPanelEditDataInstanceViewModel();

  return (
    <ControllPanelEditSub key={key} label={label} hidden={hidden} onClickNavItem={saveDataInstace}>
      <div className="optionFieldSpacer">
        <OptionField label="Instance - Name">
          <Carv2LabelTextfield
            label="Name:"
            placeholder="Data Instance Name"
            onChange={(event: any) => changeName(event.target.value)}
            value={name}
            autoFocus
            ref={textInput}
            onBlur={() => saveDataInstace()}
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
  const instanceToEdit: DataInstanceTO | null = useSelector(editSelectors.instanceToEdit);
  const dataToEdit: DataCTO | null = useSelector(
    masterDataSelectors.getDataCTOById(instanceToEdit ? instanceToEdit.dataFk : -1)
  );
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [instanceToEdit]);

  useEffect(() => {
    // check if component to edit is really set or go back to edit mode
    if (instanceToEdit === null) {
      handleError("Tried to go to edit data without dataToedit specified");
      dispatch(EditActions.setMode.edit());
    }
  });

  const changeName = (name: string) => {
    if (instanceToEdit !== null) {
      let copyInstance: DataInstanceTO = Carv2Util.deepCopy(instanceToEdit);
      copyInstance.name = name;
      dispatch(EditActions.instance.update(copyInstance));
    }
  };

  const saveDataInstace = () => {
    if (instanceToEdit !== null) {
      const copyInstance: DataInstanceTO = Carv2Util.deepCopy(instanceToEdit);
      if (copyInstance.name !== "") {
        dispatch(EditActions.instance.save(copyInstance));
      } else {
        deleteDataInstance();
      }
    }
  };

  const deleteDataInstance = () => {
    if (instanceToEdit !== null) {
      const copyInstance: DataInstanceTO = Carv2Util.deepCopy(instanceToEdit);
      dispatch(EditActions.instance.delete(copyInstance));
      dataToEdit ? dispatch(EditActions.setMode.editData(dataToEdit)) : dispatch(EditActions.setMode.edit());
    }
  };

  const createAnother = () => {
    if (instanceToEdit !== null) {
      const newInstance: DataInstanceTO = new DataInstanceTO();
      newInstance.dataFk = instanceToEdit.dataFk;
      dispatch(EditActions.setMode.editDataInstance(newInstance));
    }
  };

  return {
    label: "EDIT * DATA * INSTANCE",
    name: instanceToEdit?.name,
    changeName,
    saveDataInstace,
    textInput,
    deleteDataInstance,
    createAnother,
    key: instanceToEdit?.id,
  };
};
