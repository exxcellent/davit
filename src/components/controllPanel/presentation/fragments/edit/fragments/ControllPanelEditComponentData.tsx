import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Dropdown, DropdownItemProps } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../../../../dataAccess/access/cto/DataCTO";
import { SequenceCTO } from "../../../../../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../../../../../dataAccess/access/cto/SequenceStepCTO";
import { selectDatas } from "../../../../../../slices/DataSlice";
import { Mode } from "../../../../../../slices/GlobalSlice";
import { currentSequence, currentStep } from "../../../../../../slices/SequenceSlice";
import { Carv2Util } from "../../../../../../utils/Carv2Util";
import { getColorForComponentDataState } from "../../../../../metaComponentModel/presentation/fragments/DataFragment";
import { ControllPanelActions } from "../../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "../common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "../common/fragments/Carv2LabelTextfield";
import "./ControllPanelEdit.css";

export interface ControllPanelEditComponentDataProps {
  component: ComponentCTO | null;
}

export const ControllPanelEditComponentData: FunctionComponent<ControllPanelEditComponentDataProps> = (props) => {
  const { component } = props;

  const [label, setLabel] = useState<string>("Add Data");
  const dispatch = useDispatch();
  const datas: DataCTO[] = useSelector(selectDatas);
  const sequenceStep: SequenceStepCTO | null = useSelector(currentStep);
  const sequence: SequenceCTO | null = useSelector(currentSequence);

  const [selectedDatas, setSelectedDatas] = useState<number[]>([]);

  useEffect(() => {
    if (component !== null) {
      const selection = sequenceStep!.componentDataCTOs
        .filter((componentData) => componentData.componentTO.id === component?.component.id)
        .map((componentData) => componentData.dataTO.id);
      setSelectedDatas(selection);
    }
  }, [component, sequenceStep, setSelectedDatas]);

  const addComponentDataToSequenceStep = (componentData: ComponentDataCTO) => {
    let copySequenceStep: SequenceStepCTO = Carv2Util.deepCopy(sequenceStep);
    copySequenceStep.componentDataCTOs.push(componentData);
    dispatch(ControllPanelActions.setSequenceStepToEdit(copySequenceStep));
  };

  const updateSequence = (sequenceStep: SequenceStepCTO) => {
    let copySequence: SequenceCTO = Carv2Util.deepCopy(sequence);
    copySequence.sequenceStepCTOs.splice(sequenceStep.squenceStepTO.index, 1, sequenceStep);
    dispatch(ControllPanelActions.setSequenceToEdit(copySequence));
  };

  const dataToOption = (data: DataCTO): DropdownItemProps => {
    return {
      key: data.data.id,
      value: data.data.id,
      text: data.data.name,
    };
  };

  const closeEditComponentData = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT_SEQUENCE_STEP));
  };

  const setComponentData = (dataId: number) => {
    console.info("Data id: ", dataId);
    if (sequenceStep !== null) {
      // suche componentdata wenn sie existiert.
      let componentData: ComponentDataCTO | undefined = sequenceStep.componentDataCTOs.find(
        (componentData) =>
          componentData.componentTO.id === component?.component.id && componentData.dataTO.id === dataId
      );
      if (componentData === undefined) {
        // wenn sie nicht existert erstelle sie.
        componentData = new ComponentDataCTO();
        componentData.componentTO = component?.component!;
        console.info("DataCTOs: ", datas);
        componentData.dataTO = datas.find((data) => data.data.id === dataId)?.data!;
        console.warn("componentdata.dataTO:", componentData.dataTO);
        componentData.componentDataTO.componentFk = componentData.componentTO.id;
        componentData.componentDataTO.dataFk = componentData.dataTO.id;
        componentData.componentDataTO.sequenceStepFk = sequenceStep.squenceStepTO.id;
      }
      console.info("componentData: ", componentData);
      // componentdata zum sequence step hinzufügen.
      addComponentDataToSequenceStep(componentData);
      // step in der sequence updaten.
      updateSequence(sequenceStep);
      console.info("Sequence after add componetdata", sequence);
      // bau das label.
      return {
        color: getColorForComponentDataState(componentData.componentDataTO.componentDataState),
        content: componentData.dataTO.name,
      };
    }
  };

  return (
    <ControllPanelEditSub label={label}>
      <Carv2LabelTextfield label="Component:" value={component?.component.name} />
      <div className="optionFieldSpacer columnDivider">
        <Dropdown
          placeholder="Select Data"
          fluid
          multiple
          search
          selection
          options={datas.map(dataToOption)}
          onChange={(event, data) => {
            if (data.value !== undefined) {
              (data.value as number[]).map(setComponentData);
            }
          }}
          value={selectedDatas}
          // renderLabel={dataLabel}
        />
      </div>
      <div className="columnDivider controllPanelEditChild"></div>
      <div className="columnDivider controllPanelEditChild">
        <Button onClick={closeEditComponentData}>OK</Button>
      </div>
    </ControllPanelEditSub>
  );
};
