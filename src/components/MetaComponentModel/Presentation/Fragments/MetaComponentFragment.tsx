import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import {
  ComponentDataFragmentProps,
  createComponentDataFragment,
} from "../../../../viewDataTypes/ComponentDataFragment";

export interface MetaComponentFragmentProps {
  id: number;
  initalName: string;
  initalColor: string;
  initalWidth?: number;
  initalHeigth?: number;
  dataFragments: ComponentDataFragmentProps[];
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = (props) => {
  const { initalName, dataFragments, initalWidth, initalHeigth } = props;
  return (
    <Card raised style={{ width: initalWidth, height: initalHeigth }}>
      <Card.Content header={initalName}></Card.Content>
      {dataFragments.map(createComponentDataFragment)}
    </Card>
  );
};

export const createMetaComponentFragment = (
  componentCTO: ComponentCTO,
  componentDatas: ComponentDataFragmentProps[]
) => {
  return (
    <MetaComponentFragment
      id={componentCTO.component.id}
      initalName={componentCTO.component.name}
      initalColor={componentCTO.design.color}
      initalWidth={componentCTO.geometricalData.geometricalData.width}
      dataFragments={componentDatas}
    />
  );
};
