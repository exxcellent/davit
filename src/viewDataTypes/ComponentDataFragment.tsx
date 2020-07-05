import React from "react";
import { Card } from "semantic-ui-react";
import { ComponentDataState } from "./ComponentDataState";

export interface ComponentDataFragmentProps {
  state: ComponentDataState;
  name: string;
}

const getColorForComponentDataState = (state: ComponentDataState) => {
  // TODO: css classen anlegen.
  return "carv2ComponentData" + state;
};

export const createComponentDataFragment = (componentDataFragmentProps: ComponentDataFragmentProps, key: number) => {
  return (
    <Card.Content
      extra
      key={key}
      content={componentDataFragmentProps.name}
      className={getColorForComponentDataState(componentDataFragmentProps.state)}
    />
  );
};
