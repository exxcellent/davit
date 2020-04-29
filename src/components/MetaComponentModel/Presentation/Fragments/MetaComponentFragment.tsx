import { Box, Button, Input } from "@chakra-ui/core";
import React, { FunctionComponent, useEffect } from "react";
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
  const {
    id,
    initalName,
    initalColor,
    onDelCallBack,
    dataFragments,
    width,
    height,
  } = props;

  const delMetaComponentFragment = () => {
    onDelCallBack(id);
  };

  const [name, setName] = React.useState<string>("");
  const [color, setColor] = React.useState<string>("");

  useEffect(() => {
    setName(initalName);
    setColor(initalColor);
  }, [setName, setColor, initalName, initalColor]);

  return (
    <Box bg="#f5c6f2" w={width} h={height}>
      <Button onClick={delMetaComponentFragment}>X</Button>
      <div>ID:{id}</div>
      <div>
        <label>Name: </label>
        <Input placeholder={name} />
      </div>
      <div>
        <label>Color:</label>
        <input
          type="color"
          placeholder={color}
          onChange={(event) => {
            setColor(event.target.value);
            console.log(event.target.value);
          }}
        />
        <label>{color}</label>
      </div>
      {dataFragments.map(createDataFragment)}
    </Box>
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
