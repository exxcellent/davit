import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { ActionCTO } from "../../../../dataAccess/access/cto/ActionCTO";
import { ComponentDataCTO } from "../../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { ComponentFragmentProps, createComponentFragment } from "./ComponentFragment";

export interface MetaDataFragmentProps {
  id: number;
  initalName: string;
  initalWidth?: number;
  initalHeigth?: number;
  componentFragments: ComponentFragmentProps[];
}

export const MetaDataFragment: FunctionComponent<MetaDataFragmentProps> = (props) => {
  const { initalName, componentFragments, initalWidth, initalHeigth } = props;

  return (
    <Card style={{ width: initalWidth, height: initalHeigth }}>
      <Card.Content header={initalName}></Card.Content>
      {componentFragments.map(createComponentFragment)}
    </Card>
  );
};

const stepToComponentFragmentProps = (
  componentDatas: (ComponentDataCTO | ActionCTO)[],
  data: DataCTO
): ComponentFragmentProps[] => {
  const filteredCompData: (ComponentDataCTO | ActionCTO)[] = componentDatas.filter(
    (compData) => compData.dataTO.id === data.data.id
  );
  return filteredCompData.map((componentData: ComponentDataCTO | ActionCTO) => {
    return {
      name: componentData.componentTO.name,
      state:
        componentData instanceof ComponentDataCTO
          ? componentData.componentDataTO.componentDataState
          : componentData.actionTO.actionType,
    };
  });
};

export const createMetaDataFragment = (dataCTO: DataCTO, componentDatas: (ComponentDataCTO | ActionCTO)[]) => {
  return (
    <MetaDataFragment
      id={dataCTO.data.id}
      initalName={dataCTO.data.name}
      initalWidth={dataCTO.geometricalData.geometricalData.width}
      componentFragments={stepToComponentFragmentProps(componentDatas, dataCTO)}
    />
  );
};
