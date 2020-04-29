import { Box, Button, Input } from "@chakra-ui/core";
import React, { FunctionComponent, useEffect } from "react";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
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

export const createMetaComponentFragment = (
  componentCTO: ComponentCTO,
  dataFragments: DataFragmentProps[],
  onDeleteCallBack: (componentId: number) => void
) => {
  return (
    <MetaComponentFragment
      id={componentCTO.component.id}
      initalName={componentCTO.component.name}
      initalColor={componentCTO.design.color}
      onDelCallBack={onDeleteCallBack}
      width={componentCTO.geometricalData.geometricalData.width}
      height={componentCTO.geometricalData.geometricalData.height}
      dataFragments={dataFragments}
    />
  );
};
