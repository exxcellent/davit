import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { createViewFragment, ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";

export interface MetaDataFragmentProps {
  id: number;
  initalName: string;
  initalWidth?: number;
  initalHeigth?: number;
  componentFragments: ViewFragmentProps[];
  onClick?: (dataId: number) => void;
}

const MetaDataFragment: FunctionComponent<MetaDataFragmentProps> = (props) => {
  const { initalName, componentFragments, initalWidth, initalHeigth } = props;

  return (
    <Card
      style={{ width: initalWidth, height: initalHeigth }}
      onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
    >
      <Card.Content header={initalName}></Card.Content>
      {componentFragments.map(createViewFragment)}
    </Card>
  );
};

export const createMetaDataFragment = (
  dataCTO: DataCTO,
  componentDatas: ViewFragmentProps[],
  onClick: (dataId: number) => void
) => {
  return (
    <MetaDataFragment
      id={dataCTO.data.id}
      initalName={dataCTO.data.name}
      initalWidth={dataCTO.geometricalData.geometricalData.width}
      componentFragments={componentDatas}
      // onClick={onClick}
    />
  );
};
