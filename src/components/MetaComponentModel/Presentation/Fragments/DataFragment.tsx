import React from "react";
import { Card } from "semantic-ui-react";
import { ComponentDataState } from "../../../../dataAccess/access/types/ComponentDataState";

export interface DataFragmentProps {
  state: ComponentDataState;
  name: string;
}

export const getColorForComponentDataState = (state: ComponentDataState) => {
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

export const createDataFragment = (dataFragmentProps: DataFragmentProps, key: number) => {
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
