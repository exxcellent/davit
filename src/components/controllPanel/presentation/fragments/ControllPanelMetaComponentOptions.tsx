import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";

export interface ControllPanelMetaComponentOptionsProps {}

export const ControllPanelMetaComponentOptions: FunctionComponent<ControllPanelMetaComponentOptionsProps> = (
  props
) => {
  return (
    <div>
      <Button icon="add"></Button>
    </div>
  );
};
