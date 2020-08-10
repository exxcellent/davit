import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { InitDataTO } from "../../../../../../dataAccess/access/to/InitDataTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { DataDropDown } from "../../../../../common/fragments/dropdowns/DataDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditInitDataProps {}

export const ControllPanelEditInitData: FunctionComponent<ControllPanelEditInitDataProps> = (props) => {
  const {
    label,
    saveInitData,
    deleteInitData,
    data,
    component,
    setComponentId,
    setDataId,
    createAnother,
    key,
  } = useControllPanelEditDataSetupViewModel();

  return (
    <ControllPanelEditSub label={label} key={key}>
      <div className="controllPanelEditChild">
        <OptionField label="Select Component to which data will be added">
          <ComponentDropDown
            onSelect={(comp) => (comp ? setComponentId(comp.component.id) : setComponentId(-1))}
            placeholder="Select Component..."
            onBlur={() => {}}
            value={component}
          />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <OptionField label="Select Data which will be added">
          <DataDropDown onSelect={(data) => (data ? setDataId(data.data.id) : setDataId(-1))} value={data} />
        </OptionField>
      </div>
      <div className="columnDivider controllPanelEditChild" style={{ paddingLeft: "10px", paddingRight: "10px" }}>
        <div>
          <OptionField label="Navigation">
            <Carv2ButtonLabel onClick={createAnother} label="Create another" />
            <Carv2ButtonIcon onClick={saveInitData} icon="reply" />
          </OptionField>
        </div>
      </div>
      <div className="columnDivider controllPanelEditChild">
        <OptionField label="options">
          <Carv2DeleteButton onClick={deleteInitData} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataSetupViewModel = () => {
  const initDataToEdit: InitDataTO | null = useSelector(editSelectors.initDataToEdit);
  const dispatch = useDispatch();
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    // check if sequence to edit is really set or gos back to edit mode
    if (isNullOrUndefined(initDataToEdit)) {
      handleError("Tried to go to edit initData without initDataToedit specified");
      dispatch(EditActions.setMode.edit());
    }
    // used to focus the textfield on create another
  }, [dispatch, initDataToEdit]);

  const saveInitData = () => {
    if (!isNullOrUndefined(initDataToEdit)) {
      if (
        initDataToEdit !== null &&
        initDataToEdit?.componentFk !== -1 &&
        initDataToEdit?.dataFk !== -1 &&
        initDataToEdit?.dataSetupFk !== -1
      ) {
        dispatch(EditActions.initData.save(initDataToEdit));
      } else {
        deleteInitData();
      }
      dispatch(EditActions.setMode.editDataSetup(initDataToEdit?.dataSetupFk));
    }
  };

  const deleteInitData = () => {
    if (!isNullOrUndefined(initDataToEdit)) {
      dispatch(EditActions.initData.delete(initDataToEdit.id));
      dispatch(EditActions.setMode.editDataSetup(initDataToEdit.dataSetupFk));
    }
  };

  const setComponentId = (id: number) => {
    if (!isNullOrUndefined(initDataToEdit)) {
      const copyInitDataToEdit: InitDataTO = Carv2Util.deepCopy(initDataToEdit);
      copyInitDataToEdit.componentFk = id;
      dispatch(EditActions.initData.update(copyInitDataToEdit));
    }
  };

  const setDataId = (id: number) => {
    if (!isNullOrUndefined(initDataToEdit)) {
      const copyInitDataToEdit: InitDataTO = Carv2Util.deepCopy(initDataToEdit);
      copyInitDataToEdit.dataFk = id;
      dispatch(EditActions.initData.update(copyInitDataToEdit));
    }
  };

  const createAnother = () => {
    saveInitData();
    createInitData();
    setKey(key + 1);
  };

  const createInitData = () => {
    if (!isNullOrUndefined(initDataToEdit)) {
      const initData: InitDataTO = new InitDataTO();
      initData.dataSetupFk = initDataToEdit.dataSetupFk;
      dispatch(EditActions.setMode.editInitData(initData));
    }
  };

  return {
    label: "EDIT DATA SETUP - EDIT INIT DATA",
    data: initDataToEdit?.dataFk,
    component: initDataToEdit?.componentFk,
    deleteInitData,
    saveInitData,
    setComponentId,
    setDataId,
    createAnother,
    key,
  };
};
