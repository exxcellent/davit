import React from "react";
import { Card } from "semantic-ui-react";
import { ActionType } from "../../../../dataAccess/access/types/ActionType";
import { ComponentDataState } from "../../../../dataAccess/access/types/ComponentDataState";

export interface ComponentFragmentProps {
  state: ComponentDataState | ActionType;
  name: string;
}

const getColorForComponentDataState = (state: ComponentDataState | ActionType) => {
  switch (state) {
    case ComponentDataState.NEW:
      return "carv2ComponentDataNEW";
    case ComponentDataState.PERSISTENT:
      return "carv2ComponentDataPERSISTENT";
    case ComponentDataState.DELETED:
      return "carv2ComponentDataDELETED";
    case ActionType.ADD:
      return "carv2ComponentDataADD";
    case ActionType.CHECK:
      return "carv2ComponentDataCHECK";
    case ActionType.DELETE:
      return "carv2ComponentDataDELETE";
    default:
      return "black";
  }
};

export const createComponentFragment = (componentFragmentProps: ComponentFragmentProps, key: number) => {
  return (
    <Card.Content
      extra
      key={key}
      content={componentFragmentProps.name}
      className={getColorForComponentDataState(componentFragmentProps.state)}
    />
  );
};
