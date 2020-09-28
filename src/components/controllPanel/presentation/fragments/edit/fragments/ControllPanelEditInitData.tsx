import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { DataInstanceTO } from "../../../../../../dataAccess/access/to/DataInstanceTO";
import { DataSetupTO } from "../../../../../../dataAccess/access/to/DataSetupTO";
import { InitDataTO } from "../../../../../../dataAccess/access/to/InitDataTO";
import { EditActions, editSelectors } from "../../../../../../slices/EditSlice";
import { handleError } from "../../../../../../slices/GlobalSlice";
import { masterDataSelectors } from "../../../../../../slices/MasterDataSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { Carv2ButtonIcon, Carv2ButtonLabel } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2DeleteButton } from "../../../../../common/fragments/buttons/Carv2DeleteButton";
import { ComponentDropDown } from "../../../../../common/fragments/dropdowns/ComponentDropDown";
import { InstanceDropDown } from "../../../../../common/fragments/dropdowns/InstanceDropDown";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { OptionField } from "../common/OptionField";

export interface ControllPanelEditInitDataProps {
  hidden: boolean;
}

export const ControllPanelEditInitData: FunctionComponent<ControllPanelEditInitDataProps> = (props) => {
  const { hidden } = props;
  const {
    label,
    saveInitData,
    deleteInitData,
    data,
    component,
    setComponentId,
    setData,
    createAnother,
    key,
  } = useControllPanelEditDataSetupViewModel();

  return (
    <ControllPanelEditSub label={label} key={key} hidden={hidden} onClickNavItem={saveInitData}>
      <div className="optionFieldSpacer">
        <OptionField label="Select Component to which data will be added">
          <ComponentDropDown
            onSelect={(comp) => (comp ? setComponentId(comp.component.id) : setComponentId(-1))}
            placeholder="Select Component..."
            onBlur={() => {}}
            value={component}
          />
        </OptionField>
      </div>
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="Select Data which will be added">
          <InstanceDropDown onSelect={setData} value={data} />
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
      <div className="columnDivider optionFieldSpacer">
        <OptionField label="options">
          <Carv2DeleteButton onClick={deleteInitData} />
        </OptionField>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditDataSetupViewModel = () => {
  const initDataToEdit: InitDataTO | null = useSelector(editSelectors.initDataToEdit);
  const dataSetup: DataSetupTO | null = useSelector(
    masterDataSelectors.getDataSetupToById(initDataToEdit?.dataSetupFk || -1)
  );
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

  const saveInitData = (newMode?: string) => {
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
      if (newMode && newMode === "EDIT") {
        dispatch(EditActions.setMode.edit());
      } else {
        dispatch(EditActions.setMode.editDataSetup(initDataToEdit?.dataSetupFk));
      }
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

  const setData = (instance: DataInstanceTO | undefined): void => {
    if (instance !== undefined) {
      const copyInitDataToEdit: InitDataTO = Carv2Util.deepCopy(initDataToEdit);
      copyInitDataToEdit.dataFk = instance.dataFk;
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
    label: "EDIT * " + (dataSetup?.name || "") + " * INIT DATA",
    data: initDataToEdit?.dataFk,
    component: initDataToEdit?.componentFk,
    deleteInitData,
    saveInitData,
    setComponentId,
    setData,
    createAnother,
    key,
  };
};
