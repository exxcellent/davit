import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input } from 'semantic-ui-react';
import { isNullOrUndefined } from 'util';

import { ActorCTO } from '../../../../../../dataAccess/access/cto/ActorCTO';
import { DataSetupCTO } from '../../../../../../dataAccess/access/cto/DataSetupCTO';
import { InitDataTO } from '../../../../../../dataAccess/access/to/InitDataTO';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { Carv2Util } from '../../../../../../utils/Carv2Util';
import { Carv2ButtonIcon, Carv2ButtonLabel } from '../../../../../common/fragments/buttons/Carv2Button';
import { Carv2DeleteButton } from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import { InitDataDropDownButton } from '../../../../../common/fragments/dropdowns/InitDataDropDown';
import { ControllPanelEditSub } from '../common/ControllPanelEditSub';
import { Carv2LabelTextfield } from '../common/fragments/Carv2LabelTextfield';
import { OptionField } from '../common/OptionField';

export interface ControllPanelEditDataSetupProps {
  hidden: boolean;
}

export const ControllPanelEditDataSetup: FunctionComponent<ControllPanelEditDataSetupProps> = (props) => {
  const { hidden } = props;
  const {
    label,
    name,
    changeName,
    textInput,
    saveDataSetup,
    deleteDataSetup,
    getInitDatas,
    createAnother,
    updateDataSetup,
    editInitData,
    createInitData,
  } = useControllPanelEditDataSetupViewModel();

  return (
    <ControllPanelEditSub label={label} hidden={hidden} onClickNavItem={saveDataSetup}>
      <div className="optionFieldSpacer">
        <OptionField label="Data - SETUP NAME">
          <Carv2LabelTextfield
            label="Name:"
            placeholder="Data Setup Name ..."
            onChange={(event: any) => changeName(event.target.value)}
            value={name}
            autoFocus
            ref={textInput}
            onBlur={() => updateDataSetup()}
            unvisible={hidden}
          />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Create / edit | Init - Data">
          <Button.Group>
            <Button icon="add" inverted color="orange" onClick={createInitData} />
            <Button id="buttonGroupLabel" disabled inverted color="orange">
              Data
            </Button>
            <InitDataDropDownButton onSelect={editInitData} icon="wrench" initDatas={getInitDatas} />
          </Button.Group>
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <div>
          <OptionField label="Navigation">
            <Carv2ButtonLabel onClick={createAnother} label="Create another" />
            <Carv2ButtonIcon onClick={saveDataSetup} icon="reply" />
          </OptionField>
        </div>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="options">
          <Carv2DeleteButton onClick={deleteDataSetup} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataSetupViewModel = () => {
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
  const dispatch = useDispatch();
  const [componentToEdit, setComponentToEdit] = useState<ActorCTO | null>(null);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (isNullOrUndefined(dataSetupToEdit)) {
      handleError("Tried to go to edit dataSetup without dataSetupToedit specified");
      dispatch(EditActions.setMode.edit());
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dataSetupToEdit, dispatch]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(dataSetupToEdit)) {
      let copyDataSetupToEdit: DataSetupCTO = Carv2Util.deepCopy(dataSetupToEdit);
      copyDataSetupToEdit.dataSetup.name = name;
      dispatch(EditActions.dataSetup.update(copyDataSetupToEdit));
    }
  };

  const saveDataSetup = () => {
    if (dataSetupToEdit?.dataSetup.name !== "") {
      dispatch(EditActions.dataSetup.save(dataSetupToEdit!));
    } else {
      deleteDataSetup();
    }
    dispatch(EditActions.setMode.edit());
  };

  const deleteDataSetup = () => {
    dispatch(EditActions.dataSetup.delete(dataSetupToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const createAnother = () => {
    dispatch(EditActions.setMode.editDataSetup());
  };

  const updateDataSetup = () => {
    const copyDataSetup: DataSetupCTO = Carv2Util.deepCopy(dataSetupToEdit);
    dispatch(EditActions.dataSetup.save(copyDataSetup));
  };

  const copyDataSetup = () => {
    let copyDataSetup: DataSetupCTO = Carv2Util.deepCopy(dataSetupToEdit);
    copyDataSetup.dataSetup.name = dataSetupToEdit?.dataSetup.name + "-copy";
    copyDataSetup.dataSetup.id = -1;
    copyDataSetup.initDatas.forEach((initData) => {
      initData.id = -1;
      initData.dataSetupFk = -1;
    });
    dispatch(EditActions.setMode.editDataSetup(copyDataSetup.dataSetup.id));
  };

  const getDatas = (): number[] => {
    let dataIds: number[] = [];
    if (!isNullOrUndefined(dataSetupToEdit) && !isNullOrUndefined(componentToEdit)) {
      dataSetupToEdit.initDatas
        .filter((initData) => initData.componentFk === componentToEdit.component.id)
        .forEach((initData) => dataIds.push(initData.dataFk));
    }
    return dataIds;
  };

  const editInitData = (initData: InitDataTO | undefined) => {
    if (initData) {
      dispatch(EditActions.setMode.editInitData(initData));
    }
  };

  const createInitData = () => {
    if (!isNullOrUndefined(dataSetupToEdit)) {
      const initData: InitDataTO = new InitDataTO();
      initData.dataSetupFk = dataSetupToEdit.dataSetup.id;
      editInitData(initData);
    }
  };

  return {
    label: "EDIT * " + (dataSetupToEdit?.dataSetup.name || ""),
    name: dataSetupToEdit?.dataSetup.name,
    changeName,
    saveDataSetup,
    deleteDataSetup,
    textInput,
    copyDataSetup,
    setComponentToEdit,
    getInitDatas: dataSetupToEdit?.initDatas ? dataSetupToEdit.initDatas : [],
    getDatas,
    createAnother,
    updateDataSetup,
    editInitData,
    createInitData,
  };
};
