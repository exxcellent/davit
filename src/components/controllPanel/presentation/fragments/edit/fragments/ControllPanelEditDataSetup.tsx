import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../../../../../../dataAccess/access/cto/DataSetupCTO";
import { InitDataTO } from "../../../../../../dataAccess/access/to/InitDataTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { MultiselectDataDropDown } from "../../../../../common/fragments/dropdowns/MultiselectDataDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "../common/fragments/Carv2SubmitCancel";

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
    saveDataSetup,
    deleteDataSetup,
    setComponentToEdit,
    setInitDatas,
    getDatas,
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
        <ComponentDropDown
          onSelect={(comp) => (comp ? setComponentToEdit(comp) : setComponentToEdit(null))}
          placeholder="Select Component..."
        />
      </div>
      <div className="columnDivider controllPanelEditChild" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        <MultiselectDataDropDown onSelect={setInitDatas} selected={getDatas()} />
      </div>
      <div className="controllPanelEditChild columnDivider">
        <Carv2SubmitCancel onSubmit={saveDataSetup} onCancel={cancel} submitCondition={validateInput()} />
        {/* TODO: create copy function for data setup. */}
        {/* {showExistingOptions && <Carv2Button icon="copy" onClick={copyDataSetup} />} */}
        {showExistingOptions && <Carv2DeleteButton onClick={deleteDataSetup} />}
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataSetupViewModel = () => {
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
  const dispatch = useDispatch();
  const [componentToEdit, setComponentToEdit] = useState<ComponentCTO | null>(null);
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
    dispatch(EditActions.dataSetup.save(dataSetupToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const deleteDataSetup = () => {
    dispatch(EditActions.dataSetup.delete(dataSetupToEdit!));
    dispatch(EditActions.setMode.edit());
  };

  const cancel = () => {
    dispatch(EditActions.setMode.edit());
  };

  const validateInput = (): boolean => {
    if (!isNullOrUndefined(dataSetupToEdit)) {
      return dataSetupToEdit.dataSetup.name.length > 0;
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
    dispatch(EditActions.setMode.editDataSetup(copyDataSetup.dataSetup));
  };

  const setInitDatas = (dataCTOs: DataCTO[] | undefined): void => {
    if (!isNullOrUndefined(dataSetupToEdit) && !isNullOrUndefined(componentToEdit) && dataCTOs !== undefined) {
      let copyDataSetupToEdit: DataSetupCTO = Carv2Util.deepCopy(dataSetupToEdit);
      // remove old init data.
      const clearInitDatas: InitDataTO[] = Carv2Util.deepCopy(
        dataSetupToEdit.initDatas.filter((initData) => initData.componentFk !== componentToEdit.component.id)
      );
      // add new init data.
      dataCTOs.forEach((data) =>
        clearInitDatas.push({
          id: -1,
          componentFk: componentToEdit.component.id,
          dataFk: data.data.id,
          dataSetupFk: dataSetupToEdit.dataSetup.id,
        })
      );
      copyDataSetupToEdit.initDatas = clearInitDatas;
      dispatch(EditActions.dataSetup.update(copyDataSetupToEdit));
    }
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
    setComponentToEdit,
    setInitDatas,
    getDatas,
  };
};
