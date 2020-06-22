import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { ActionCTO } from "../../../../dataAccess/access/cto/ActionCTO";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { ComponentDataCTO } from "../../../../dataAccess/access/cto/ComponentDataCTO";
import { createDataFragment, DataFragmentProps } from "./DataFragment";

export interface MetaComponentFragmentProps {
  id: number;
  initalName: string;
  initalColor: string;
  initalWidth?: number;
  initalHeigth?: number;
  dataFragments: DataFragmentProps[];
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = (props) => {
  const { initalName, dataFragments, initalWidth, initalHeigth } = props;
  return (
    <Card raised style={{ width: initalWidth, height: initalHeigth }}>
      <Card.Content header={initalName}></Card.Content>
      {dataFragments.map(createDataFragment)}
    </Card>
  );
};

const componentDataToDataFragmentProps = (
  componentDatas: (ComponentDataCTO | ActionCTO)[],
  component: ComponentCTO
): DataFragmentProps[] => {
  const filteredCompData: (ComponentDataCTO | ActionCTO)[] = componentDatas.filter(
    (compData) => compData.componentTO.id === component.component.id
  );
  return filteredCompData.map((componentData: ComponentDataCTO | ActionCTO) => {
    return {
      name: componentData.dataTO.name,
      state:
        componentData instanceof ComponentDataCTO
          ? componentData.componentDataTO.componentDataState
          : componentData.actionTO.actionType,
    };
  });
};

export const createMetaComponentFragment = (
  componentCTO: ComponentCTO,
  componentDatas: (ComponentDataCTO | ActionCTO)[]
) => {
  return (
    <MetaComponentFragment
      id={componentCTO.component.id}
      initalName={componentCTO.component.name}
      initalColor={componentCTO.design.color}
      initalWidth={componentCTO.geometricalData.geometricalData.width}
      dataFragments={componentDataToDataFragmentProps(componentDatas, componentCTO)}
    />
  );
};
