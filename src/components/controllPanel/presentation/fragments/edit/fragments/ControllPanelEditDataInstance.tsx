import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'semantic-ui-react';

import { DataCTO } from '../../../../../../dataAccess/access/cto/DataCTO';
import { DataInstanceTO } from '../../../../../../dataAccess/access/to/DataInstanceTO';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { Carv2Util } from '../../../../../../utils/Carv2Util';
import { Carv2ButtonIcon, Carv2ButtonLabel } from '../../../../../common/fragments/buttons/Carv2Button';
import { Carv2DeleteButton } from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import { ControllPanelEditSub } from '../common/ControllPanelEditSub';
import { Carv2LabelTextfield } from '../common/fragments/Carv2LabelTextfield';
import { OptionField } from '../common/OptionField';

export interface ControllPanelEditDataInstanceProps {
  hidden: boolean;
}

export const ControllPanelEditDataInstance: FunctionComponent<ControllPanelEditDataInstanceProps> = (
  props
) => {
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
    <ControllPanelEditSub
      key={key}
      label={label}
      hidden={hidden}
      onClickNavItem={saveDataInstace}
    >
      <div className="optionFieldSpacer">
        <OptionField label="Instance - Name">
          <Carv2LabelTextfield
            label="Name:"
            placeholder="Data Instance Name"
            onChange={(event: any) => changeName(event.target.value)}
            value={name}
            autoFocus
            ref={textInput}
            // onBlur={() => saveDataInstace()}
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
  const instanceIndex: number | null = null;
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dataToEdit]);

  useEffect(() => {
    // check if component to edit is really set or go back to edit mode
    if (dataToEdit === null) {
      handleError("Tried to go to edit data without dataToedit specified");
      dispatch(EditActions.setMode.edit());
    }
  });

  const changeName = (name: string) => {
    if (dataToEdit !== null && instanceIndex !== null) {
      let copyData: DataCTO = Carv2Util.deepCopy(dataToEdit);
      copyData.data.instances[instanceIndex].name = name;
      dispatch(EditActions.data.update(copyData));
    }
  };

  const saveDataInstace = () => {
    if (dataToEdit !== null && instanceIndex !== null) {
      const copyData: DataCTO = Carv2Util.deepCopy(dataToEdit);
      if (copyData.data.instances[instanceIndex].name !== "") {
        dispatch(EditActions.data.save(copyData));
      } else {
        deleteDataInstance();
      }
      dispatch(EditActions.setMode.editData(copyData));
    }
  };

  const deleteDataInstance = () => {
    if (dataToEdit !== null && instanceIndex !== null) {
      const copyData: DataCTO = Carv2Util.deepCopy(dataToEdit);
      copyData.data.instances.splice(instanceIndex, 1);
      dispatch(EditActions.data.save(copyData));
      dispatch(EditActions.setMode.editData(copyData));
    } else {
      dispatch(EditActions.setMode.edit());
    }
  };

  const createAnother = () => {
    if (dataToEdit !== null) {
      const copyData = Carv2Util.deepCopy(dataToEdit);
      const newInstance: DataInstanceTO = new DataInstanceTO();
      // TODO: create new id for instance.
      copyData.data.instances.push(newInstance);
      dispatch(EditActions.setMode.editDataInstance(copyData));
    }
  };

  return {
    label: "EDIT * DATA * INSTANCE",
    name:
      instanceIndex && dataToEdit
        ? dataToEdit.data.instances[instanceIndex].name
        : "instance not found",
    changeName,
    saveDataInstace,
    textInput,
    deleteDataInstance,
    createAnother,
    key:
      instanceIndex && dataToEdit
        ? dataToEdit.data.instances[instanceIndex].name
        : 1,
  };
};
