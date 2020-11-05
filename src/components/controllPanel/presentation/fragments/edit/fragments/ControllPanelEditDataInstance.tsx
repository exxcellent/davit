import React, {FunctionComponent, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Input} from 'semantic-ui-react';
import {DataCTO} from '../../../../../../dataAccess/access/cto/DataCTO';
import {EditActions, editSelectors} from '../../../../../../slices/EditSlice';
import {handleError} from '../../../../../../slices/GlobalSlice';
import {Carv2Util} from '../../../../../../utils/Carv2Util';
import {Carv2DeleteButton} from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import {DavitButtonIcon, DavitButtonLabel} from '../../../../../common/fragments/buttons/DavitButton';
import {ControllPanelEditSub} from '../common/ControllPanelEditSub';
import {Carv2LabelTextfield} from '../common/fragments/Carv2LabelTextfield';
import {OptionField} from '../common/OptionField';


export interface ControllPanelEditDataInstanceProps {
  hidden: boolean;
}

export const ControllPanelEditDataInstance: FunctionComponent<ControllPanelEditDataInstanceProps> = (
    props,
) => {
  const {hidden} = props;
  const {
    label,
    textInput,
    changeName,
    getName,
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
            value={getName()}
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
            <DavitButtonLabel onClick={createAnother} label="Create another" />
            <DavitButtonIcon onClick={saveDataInstace} icon="reply" />
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
  const instanceId: number | null = useSelector(editSelectors.instanceIdToEdit);
  const dispatch = useDispatch();
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dataToEdit]);

  useEffect(() => {
    // check if component to edit is really set or go back to edit mode
    if (dataToEdit === null && instanceId === -1) {
      handleError('Tried to go to edit data without dataToedit specified');
      dispatch(EditActions.setMode.edit());
    }
  });

  const changeName = (name: string) => {
    if (dataToEdit !== null && instanceId !== null) {
      const copyData: DataCTO = Carv2Util.deepCopy(dataToEdit);
      copyData.data.instances.find(
          (inst) => inst.id === instanceId,
      )!.name = name;
      dispatch(EditActions.data.save(copyData));
      dispatch(EditActions.data.update(copyData));
    }
  };

  const saveDataInstace = () => {
    if (dataToEdit !== null && instanceId !== null) {
      const copyData: DataCTO = Carv2Util.deepCopy(dataToEdit);
      if (
        copyData.data.instances.find((inst) => inst.id === instanceId)!.name
        === ''
      ) {
        deleteDataInstance();
      } else {
        dispatch(EditActions.data.save(copyData));
        dispatch(EditActions.setMode.editData(copyData));
      }
    }
  };

  const deleteDataInstance = () => {
    if (dataToEdit !== null && instanceId !== null) {
      const copyData: DataCTO = Carv2Util.deepCopy(dataToEdit);
      copyData.data.instances = copyData.data.instances.filter(
          (inst) => inst.id !== instanceId,
      );
      dispatch(EditActions.data.save(copyData));
      dispatch(EditActions.setMode.editData(copyData));
    }
  };

  const createAnother = () => {
    if (dataToEdit !== null) {
      dispatch(EditActions.setMode.editDataInstance());
    }
  };

  const getName = (): string => {
    let name = '';
    const instance = dataToEdit?.data.instances.find(
      (inst) => inst.id === instanceId
    );
    if (instance) {
      name = instance.name;
    } else {
      name = 'could not find instance!';
    }
    return name;
  };

  return {
    label: 'EDIT * DATA * INSTANCE',
    getName,
    changeName,
    saveDataInstace,
    textInput,
    deleteDataInstance,
    createAnother,
    key:
      instanceId && dataToEdit
        ? dataToEdit.data.instances.find((inst) => inst.id === instanceId)!.id
        : -1,
  };
};
