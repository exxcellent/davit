import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { ComponentDataTO } from "../../../../../../dataAccess/access/to/ComponentDataTO";
import { ComponentDataState } from "../../../../../../dataAccess/access/types/ComponentDataState";
import { currentComponent } from "../../../../../../slices/ComponentSlice";
import { GlobalActions, handleError } from "../../../../../../slices/GlobalSlice";
import { currentStep, SequenceActions } from "../../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { useGetMultiSelectDataDropdown } from "../common/fragments/Carv2DropDown";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";

export interface ControllPanelEditComponentDataProps {}

export const ControllPanelEditComponentData: FunctionComponent<ControllPanelEditComponentDataProps> = (props) => {
  const { label, name, cancel, setComponentData, selectedDataIds } = useControllPanelEditComponentDataViewModel();

  return (
    <ControllPanelEditSub label={label}>
      <Carv2LabelTextfield label="Component:" value={name} />
      <div className="optionFieldSpacer columnDivider">
        {useGetMultiSelectDataDropdown(setComponentData, selectedDataIds)}
      </div>
      <div className="columnDivider controllPanelEditChild"></div>
      <div className="columnDivider controllPanelEditChild">
        <Button onClick={cancel}>OK</Button>
      </div>
    </ControllPanelEditSub>
  );
};

const useControllPanelEditComponentDataViewModel = () => {
  const stepToEdit: SequenceStepCTO | null = useSelector(currentStep);
  const componentToEdit: ComponentCTO | null = useSelector(currentComponent);
  const dispatch = useDispatch();
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);

  useEffect(() => {
    // check if component to edit is really set or gos back to edit mode
    if (isNullOrUndefined(componentToEdit)) {
      GlobalActions.setModeToEdit();
      handleError("Tried to go to edit component data without componentToedit specified");
    }
    // used to focus the textfield on create another
  }, [componentToEdit]);

  const setComponentData = (datas: DataCTO[]) => {
    if (!isNullOrUndefined(componentToEdit) && !isNullOrUndefined(stepToEdit)) {
      const copyStepToEdit: SequenceStepCTO = Carv2Util.deepCopy(stepToEdit);

      const persistentCompDatas = copyStepToEdit.componentDataCTOs.filter(
        (compData) => compData.componentDataTO.id !== -1 && compData.componentTO.id === componentToEdit.component.id
      );
      // filter out all component datas with current component.
      copyStepToEdit.componentDataCTOs = copyStepToEdit.componentDataCTOs.filter(
        (compDat) => compDat.componentTO.id !== componentToEdit.component.id
      );

      // create componentDatas from selected datas.
      const selectedComponentData: ComponentDataCTO[] = datas.map((data) => {
        return new ComponentDataCTO(
          new ComponentDataTO(
            stepToEdit.squenceStepTO.id,
            componentToEdit.component.id,
            data.data.id,
            ComponentDataState.NEW
          ),
          componentToEdit.component,
          data.data
        );
      });
      // // setIds
      selectedComponentData.forEach((compData) => {
        const foundCompData = persistentCompDatas.find((item) => item.dataTO.id === compData.dataTO.id);
        if (foundCompData) {
          compData.componentDataTO.id = foundCompData.componentDataTO.id;
        }
      });

      copyStepToEdit.componentDataCTOs.push(...selectedComponentData);
      // save in state
      dispatch(SequenceActions.updateCurrentSequenceStep(copyStepToEdit));
    }
  };

  return {
    label: componentToEdit?.component.id === -1 ? "ADD COMPONENT DATA" : "EDIT COMPONENT DATA",
    name: componentToEdit?.component.name,
    cancel: () => dispatch(GlobalActions.setModeToEditStep(stepToEdit?.squenceStepTO.index)),
    toggleIsCreateAnother: () => setIsCreateAnother(!isCreateAnother),
    setComponentData,
    selectedDataIds:
      stepToEdit?.componentDataCTOs
        .filter((compData) => compData.componentTO.id === componentToEdit?.component.id)
        .filter((compData) => compData.componentDataTO.componentDataState !== ComponentDataState.DELETED)
        .map((componentData) => componentData.dataTO.id) || [],
  };
};
