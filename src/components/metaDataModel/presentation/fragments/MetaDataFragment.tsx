import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
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

const stepToComponentFragmentProps = (componentDatas: ComponentDataCTO[]): ComponentFragmentProps[] => {
  return componentDatas.map((componentData) => {
    return {
      name: componentData.componentTO.name,
      state: componentData.componentDataTO.componentDataState,
    };
  });
};

export const createMetaDataFragment = (dataCTO: DataCTO, componentDatas: ComponentDataCTO[]) => {
  return (
    <MetaDataFragment
      id={dataCTO.data.id}
      initalName={dataCTO.data.name}
      initalWidth={dataCTO.geometricalData.geometricalData.width}
      componentFragments={stepToComponentFragmentProps(componentDatas)}
    />
  );
};
