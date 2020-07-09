import React from "react";
import { Card } from "semantic-ui-react";
import { ViewFragmentState } from "./ViewFragmentState";

export interface ViewFragmentProps {
  state: ViewFragmentState;
  name: string;
}

const getColorForComponentDataState = (state: ViewFragmentState) => {
  // TODO: css classen anlegen.
  return "carv2ComponentData" + state;
};

export const createViewFragment = (componentDataFragmentProps: ViewFragmentProps, key: number) => {
  return (
    <Card.Content
      extra
      key={key}
      content={componentDataFragmentProps.name}
      className={getColorForComponentDataState(componentDataFragmentProps.state)}
    />
  );
};
