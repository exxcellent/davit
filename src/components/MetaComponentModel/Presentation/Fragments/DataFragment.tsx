import React from "react";
import { Card } from "semantic-ui-react";
import { ActionType } from "../../../../dataAccess/access/types/ActionType";
import { ComponentDataState } from "../../../../dataAccess/access/types/ComponentDataState";

export interface DataFragmentProps {
  state: ComponentDataState | ActionType;
  name: string;
}

export const getClassNameForState = (state: ComponentDataState | ActionType) => {
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

export const createDataFragment = (dataFragmentProps: DataFragmentProps, key: number) => {
  return (
    <Card.Content
      extra
      key={key}
      content={dataFragmentProps.name}
      className={getClassNameForState(dataFragmentProps.state)}
    />
  );
};
