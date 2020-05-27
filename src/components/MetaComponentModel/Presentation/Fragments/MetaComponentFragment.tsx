import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../../dataAccess/access/cto/ComponentDataCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { createDataFragment, DataFragmentProps } from "./DataFragment";

export interface MetaComponentFragmentProps {
  id: number;
  initalName: string;
  initalColor: string;
  initalWidth?: number;
  initalHeigth?: number;
  dataFragments: DataFragmentProps[];
  onDelCallBack: (id: number) => void;
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = (
  props
) => {
  const {
    // id,
    initalName,
    dataFragments,
    initalWidth,
    initalHeigth,
  } = props;

  // const mode: Mode = useSelector(selectMode);

  return (
    <Card raised style={{ width: initalWidth, height: initalHeigth }}>
      <Card.Content header={initalName}></Card.Content>
      {dataFragments.map(createDataFragment)}
    </Card>
  );
};

const stepToDataFragmentProps = (
  step: SequenceStepCTO | null,
  componentId: number
): DataFragmentProps[] => {
  const componentData: ComponentDataCTO[] = step
    ? step.componentDataCTOs.filter(
        (componentData) => componentData.componentTO.id === componentId
      )
    : [];
  return componentData.map((componentData) => {
    return {
      name: componentData.dataTO.name,
      state: componentData.componentDataTO.componentDataState,
    };
  });
};

export const createMetaComponentFragment = (
  componentCTO: ComponentCTO,
  onDeleteCallBack: (componentId: number) => void,
  step: SequenceStepCTO | null
) => {
  return (
    <MetaComponentFragment
      id={componentCTO.component.id}
      initalName={componentCTO.component.name}
      initalColor={componentCTO.design.color}
      initalWidth={componentCTO.geometricalData.geometricalData.width}
      onDelCallBack={onDeleteCallBack}
      dataFragments={stepToDataFragmentProps(step, componentCTO.component.id)}
    />
  );
};
