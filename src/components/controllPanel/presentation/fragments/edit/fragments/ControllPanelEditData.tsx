import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';

import { DataCTO } from '../../../../../../dataAccess/access/cto/DataCTO';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { Carv2Util } from '../../../../../../utils/Carv2Util';
import { Carv2ButtonIcon, Carv2ButtonLabel } from '../../../../../common/fragments/buttons/Carv2Button';
import { Carv2DeleteButton } from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import { DataInstanceDropDownButton } from '../../../../../common/fragments/dropdowns/DataInstanceDropDown';
import { ControllPanelEditSub } from '../common/ControllPanelEditSub';
import { Carv2LabelTextfield } from '../common/fragments/Carv2LabelTextfield';
import { OptionField } from '../common/OptionField';

export interface ControllPanelEditDataProps {
  hidden: boolean;
}

export const ControllPanelEditData: FunctionComponent<ControllPanelEditDataProps> = (
  props
) => {
  const { hidden } = props;
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
    id,
  } = useControllPanelEditDataViewModel();

  return (
    <ControllPanelEditSub
      key={id}
      label={label}
      hidden={hidden}
      onClickNavItem={saveData}
    >
      <div className="optionFieldSpacer">
        <OptionField label="Data - Name">
          <Carv2LabelTextfield
            label="Name:"
            placeholder="Data Name"
            onChange={(event: any) => changeName(event.target.value)}
            value={name}
            autoFocus
            ref={textInput}
            onBlur={() => updateData()}
            unvisible={hidden}
          />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="create / edit | Data - Instance">
          <Button.Group>
            <Button
              icon="add"
              inverted
              color="orange"
              onClick={() => editOrAddInstance()}
            />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Instance
            </Button>
            <DataInstanceDropDownButton
              onSelect={(id) => editOrAddInstance(id)}
              icon={"wrench"}
              instances={instances}
            />
          </Button.Group>
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <div>
          <OptionField label="Navigation">
            <Carv2ButtonLabel onClick={createAnother} label="Create another" />
            <Carv2ButtonIcon onClick={saveData} icon="reply" />
          </OptionField>
        </div>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Data - Options">
          <Carv2DeleteButton onClick={deleteData} />
        </OptionField>
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
    if (dataToEdit === null || dataToEdit === undefined) {
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
    if (dataToEdit?.data.name !== "") {
      dispatch(EditActions.data.save(dataToEdit!));
    } else {
      deleteData();
    }
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
    if (dataToEdit !== null) {
      console.info("id: ", id);
      dispatch(EditActions.setMode.editDataInstance(id));
    }
  };

  return {
    label: "EDIT * " + (dataToEdit?.data.name || ""),
    name: dataToEdit?.data.name,
    changeName,
    saveData,
    deleteData,
    textInput,
    updateData,
    createAnother,
    instances: dataToEdit?.data.instances ? dataToEdit.data.instances : [],
    editOrAddInstance,
    id: dataToEdit?.data.id || -1,
  };
};
