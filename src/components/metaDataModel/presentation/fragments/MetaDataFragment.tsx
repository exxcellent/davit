import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Button, Card } from "semantic-ui-react";
import { ComponentDataCTO } from "../../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import { Mode, selectMode } from "../../../common/viewModel/GlobalSlice";
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
    id,
    initalName,
    onDelCallBack,
    componentFragments,
    initalWidth,
    initalHeigth,
  } = props;

  console.log("Create Data Fragment!");

  const mode: Mode = useSelector(selectMode);

  const delMetaComponentFragment = () => {
    onDelCallBack(id);
  };

  return (
    <Card style={{ width: initalWidth, height: initalHeigth }}>
      <Card.Content header={initalName}></Card.Content>
      <Card.Content>
        {mode === Mode.EDIT && (
          <Button
            size="mini"
            icon="delete"
            onClick={delMetaComponentFragment}
          />
        )}
      </Card.Content>
      {componentFragments.map(createComponentFragment)}
    </Card>
  );
};

const stepToComponentFragmentProps = (
  step: SequenceStepCTO | undefined,
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
  step?: SequenceStepCTO
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
