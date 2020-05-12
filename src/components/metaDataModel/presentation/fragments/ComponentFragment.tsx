import React from "react";
import { Card } from "semantic-ui-react";
import { ComponentDataState } from "../../../../dataAccess/access/types/ComponentDataState";

export interface ComponentFragmentProps {
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

export const createComponentFragment = (
  componentFragmentProps: ComponentFragmentProps,
  key: number
) => {
  console.info("Create Component Fragment.");
  return (
    <Card.Content
      extra
      key={key}
      content={componentFragmentProps.name}
      style={{
        backgroundColor: getColorForComponentDataState(
          componentFragmentProps.state
        ),
        color: "white",
      }}
    />
  );
};
