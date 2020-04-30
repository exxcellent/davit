import { ComponentDataState } from "../../../../dataAccess/access/types/ComponentDataState";
import React from "./node_modules/react";
import { Card } from "./node_modules/semantic-ui-react";

export interface DataFragmentProps {
  state: ComponentDataState;
  name: string;
}

const getColorForComponentDataState = (state: ComponentDataState) => {
  switch (state) {
    case ComponentDataState.NEW:
      return "#6CBF8F";
    case ComponentDataState.PERSISTENT:
      return "#c8c8c8";
    case ComponentDataState.DELETED:
      return "#af0837";
    default:
      return "black";
  }
};

export const createDataFragment = (
  dataFragmentProps: DataFragmentProps,
  key: number
) => {
  console.info("create Data.");
  return (
    <Card.Content
      extra
      key={key}
      content={dataFragmentProps.name}
      style={{
        backgroundColor: getColorForComponentDataState(dataFragmentProps.state),
        color: "white",
      }}
    />
  );
};
