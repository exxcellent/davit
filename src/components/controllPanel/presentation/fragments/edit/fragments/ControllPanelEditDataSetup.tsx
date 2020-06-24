import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataSetupCTO } from "../../../../../../dataAccess/access/cto/DataSetupCTO";
import { GlobalActions, handleError } from "../../../../../../slices/GlobalSlice";
import { currentDataSetupToEdit, SequenceActions } from "../../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2Button } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { MultiselectDataDropDown } from "../../../../../common/fragments/dropdowns/MultiselectDataDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancelNoCheckBox } from "../common/fragments/Carv2SubmitCancel";

export interface ControllPanelEditDataSetupProps {}

export const ControllPanelEditDataSetup: FunctionComponent<ControllPanelEditDataSetupProps> = (props) => {
  const {
    label,
    name,
    changeName,
    textInput,
    showExistingOptions,
    cancel,
    validateInput,
    copyDataSetup,
    setComponentId,
    saveDataSetup,
    deleteDataSetup,
  } = useControllPanelEditDataSetupViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <div className="controllPanelEditChild">
        <Carv2LabelTextfield
          label="Name:"
          placeholder="Data Setup Name ..."
          onChange={(event: any) => changeName(event.target.value)}
          value={name}
          autoFocus
          ref={textInput}
        />
      </div>
      <div className="columnDivider controllPanelEditChild">
        <ComponentDropDown onSelect={setComponentId} placeholder="Select Component..." />
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <MultiselectDataDropDown onSelect={() => {}} selected={[]} />
      </div>
      <div className="controllPanelEditChild columnDivider">
        <Carv2SubmitCancelNoCheckBox
          onSubmit={saveDataSetup}
          onChange={() => {}}
          onCancel={cancel}
          submitCondition={validateInput()}
        />
        {showExistingOptions && <Carv2Button icon="copy" onClick={copyDataSetup} />}
        {showExistingOptions && <Carv2DeleteButton onClick={deleteDataSetup} />}
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataSetupViewModel = () => {
  const dataSetupToEdit: DataSetupCTO | null = useSelector(currentDataSetupToEdit);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);
  const [componentToEdit, setComponentToEdit] = useState<ComponentCTO | null>(null);
  const textInput = useRef<Input>(null);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (isNullOrUndefined(dataSetupToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit dataSetup without dataSetupToedit specified");
    }
    if (dataSetupToEdit?.dataSetup.id !== -1) {
      setIsCreateAnother(false);
    }
    // used to focus the textfield on create another
    textInput.current!.focus();
  }, [dataSetupToEdit]);

  const changeName = (name: string) => {
    if (!isNullOrUndefined(dataSetupToEdit)) {
      let copyDataSetupToEdit: DataSetupCTO = Carv2Util.deepCopy(dataSetupToEdit);
      copyDataSetupToEdit.dataSetup.name = name;
      dispatch(SequenceActions.updateCurrentDataSetupToEdit(copyDataSetupToEdit));
    }
  };

  const saveDataSetup = () => {
    dispatch(SequenceActions.saveDataSetup(dataSetupToEdit!));
    dispatch(SequenceActions.clearCurrentDataSetupToEdit);
    dispatch(GlobalActions.setModeToEdit());
  };

  const deleteDataSetup = () => {
    dispatch(SequenceActions.deleteDataSetup(dataSetupToEdit!));
    dispatch(SequenceActions.clearCurrentDataSetupToEdit);
    dispatch(GlobalActions.setModeToEdit());
  };

  const cancel = () => {
    dispatch(SequenceActions.clearCurrentDataSetupToEdit);
    dispatch(GlobalActions.setModeToEdit());
  };

  const validateInput = (): boolean => {
    if (!isNullOrUndefined(dataSetupToEdit)) {
      return Carv2Util.isValidName(dataSetupToEdit.dataSetup.name);
    } else {
      return false;
    }
  };

  const copyDataSetup = () => {
    let copyDataSetup: DataSetupCTO = Carv2Util.deepCopy(dataSetupToEdit);
    copyDataSetup.dataSetup.name = dataSetupToEdit?.dataSetup.name + "-copy";
    copyDataSetup.dataSetup.id = -1;
    copyDataSetup.initDatas.forEach((initData) => {
      initData.id = -1;
      initData.dataSetupFk = -1;
    });
    dispatch(SequenceActions.updateCurrentDataSetupToEdit(copyDataSetup));
  };

  // const getInitDatas = (componentId: number): InitDataCTO[] | undefined => {
  //   if (!isNullOrUndefined(dataSetupToEdit)) {
  //     return dataSetupToEdit.initDatas.filter((initData) => initData.component.component.id === componentId);
  //   }
  // };

  const setComponentId = (component: ComponentCTO | undefined): void => {
    if (component === undefined) {
      setComponentToEdit(null);
    } else {
      setComponentToEdit(component);
    }
  };

  // const getComponentDatas = (): number[] | [] => {
  //   let dataKeys: number[] = [];
  //   if (!isNullOrUndefined(componentToEdit)) {
  //     const initDatas: InitDataCTO[] | undefined = getInitDatas(componentToEdit.component.id);
  //     if (initDatas !== undefined) {
  //       initDatas.forEach((initData) => dataKeys.push(initData.data.data.id));
  //     }
  //   }
  //   return dataKeys;
  // };

  // const setInitDatasToDataSetup = (datas: DataCTO[]): void => {
  //   if (!isNullOrUndefined(dataSetupToEdit) && !isNullOrUndefined(componentToEdit)) {
  //     const copyInitDatas: InitDataCTO[] = Carv2Util.deepCopy(dataSetupToEdit.initDatas);
  //     const dataToKeep: InitDataCTO[] = copyInitDatas.filter(
  //       (initData) => initData.component.component.id !== componentToEdit.component.id
  //     );
  //     let neweInitdatas: InitDataCTO[] = [];
  //     // set new initDatas
  //     datas.forEach((newData) =>
  //       neweInitdatas.push(
  //         new InitDataCTO({
  //           id: -1,
  //           initData: new InitDataTO({
  //             id: -1,
  //           }),
  //           component: componentToEdit,
  //           data: newData,
  //         })
  //       )
  //     );
  //   }
  // };

  return {
    label: dataSetupToEdit?.dataSetup.id === -1 ? "ADD DATA SETUP" : "EDIT DATA SETUP",
    name: dataSetupToEdit?.dataSetup.name,
    changeName,
    cancel,
    saveDataSetup,
    deleteDataSetup,
    textInput,
    showExistingOptions: dataSetupToEdit?.dataSetup.id !== -1,
    validateInput,
    copyDataSetup,
    setComponentId,
    // getComponentDatas,
  };
};
