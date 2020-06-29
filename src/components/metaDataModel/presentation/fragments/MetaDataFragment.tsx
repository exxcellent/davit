import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import {
  ComponentDataFragmentProps,
  createComponentDataFragment,
} from "../../../common/fragments/ComponentDataFragment";

export interface MetaDataFragmentProps {
  id: number;
  initalName: string;
  initalWidth?: number;
  initalHeigth?: number;
  componentFragments: ComponentDataFragmentProps[];
}

const MetaDataFragment: FunctionComponent<MetaDataFragmentProps> = (props) => {
  const { initalName, componentFragments, initalWidth, initalHeigth } = props;

  return (
    <Card style={{ width: initalWidth, height: initalHeigth }}>
      <Card.Content header={initalName}></Card.Content>
      {componentFragments.map(createComponentDataFragment)}
    </Card>
  );
};

export const createMetaDataFragment = (dataCTO: DataCTO, componentDatas: ComponentDataFragmentProps[]) => {
  return (
    <MetaDataFragment
      id={dataCTO.data.id}
      initalName={dataCTO.data.name}
      initalWidth={dataCTO.geometricalData.geometricalData.width}
      componentFragments={componentDatas}
    />
  );
};
