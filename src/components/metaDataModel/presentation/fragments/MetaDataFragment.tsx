import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { ComponentDataCTO } from "../../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import {
  ComponentFragmentProps,
  createComponentFragment,
} from "./ComponentFragment";

export interface MetaDataFragmentProps {
  id: number;
  initalName: string;
  initalWidth?: number;
  initalHeigth?: number;
  componentFragments: ComponentFragmentProps[];
  onDelCallBack: (id: number) => void;
}

export const MetaDataFragment: FunctionComponent<MetaDataFragmentProps> = (
  props
) => {
  const {
    // id,
    initalName,
    componentFragments,
    initalWidth,
    initalHeigth,
  } = props;

  // const mode: Mode = useSelector(selectMode);

  return (
    <Card style={{ width: initalWidth, height: initalHeigth }}>
      <Card.Content header={initalName}></Card.Content>
      {componentFragments.map(createComponentFragment)}
    </Card>
  );
};

const stepToComponentFragmentProps = (
  step: SequenceStepCTO | null,
  dataId: number
): ComponentFragmentProps[] => {
  const componentData: ComponentDataCTO[] = step
    ? step.componentDataCTOs.filter(
        (componentData) => componentData.dataTO.id === dataId
      )
    : [];
  return componentData.map((componentData) => {
    return {
      name: componentData.componentTO.name,
      state: componentData.componentDataTO.componentDataState,
    };
  });
};

export const createMetaDataFragment = (
  dataCTO: DataCTO,
  onDeleteCallBack: (componentId: number) => void,
  step: SequenceStepCTO | null
) => {
  return (
    <MetaDataFragment
      id={dataCTO.data.id}
      initalName={dataCTO.data.name}
      initalWidth={dataCTO.geometricalData.geometricalData.width}
      onDelCallBack={onDeleteCallBack}
      componentFragments={stepToComponentFragmentProps(step, dataCTO.data.id)}
    />
  );
};
