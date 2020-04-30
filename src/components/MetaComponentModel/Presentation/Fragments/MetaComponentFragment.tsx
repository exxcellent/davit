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
  dataFragments: DataFragmentProps[];
  width: number;
  height: number;
  onDelCallBack: (id: number) => void;
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = (
  props
) => {
  const { id, initalName, onDelCallBack, dataFragments, width, height } = props;

  const delMetaComponentFragment = () => {
    onDelCallBack(id);
  };

  return (
    <div style={{ width: width, height: height }}>
      <Card fluid>
        <Card.Content header={initalName}>
          {/* <Button size="mini" icon="delete" onClick={delMetaComponentFragment} /> */}
        </Card.Content>
        <Card.Content description="" />
        {dataFragments.map(createDataFragment)}
      </Card>
    </div>
  );
};

const stepToDataFragmentProps = (
  step: SequenceStepCTO | undefined,
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
  step?: SequenceStepCTO
) => {
  return (
    <MetaComponentFragment
      id={componentCTO.component.id}
      initalName={componentCTO.component.name}
      initalColor={componentCTO.design.color}
      onDelCallBack={onDeleteCallBack}
      width={componentCTO.geometricalData.geometricalData.width}
      height={componentCTO.geometricalData.geometricalData.height}
      dataFragments={stepToDataFragmentProps(step, componentCTO.component.id)}
    />
  );
};
