import React, { FunctionComponent } from "react";
import { Carv2Button } from "../../../../../../common/fragments/buttons/Carv2Button";
import { Carv2Checkbox } from "../../../../../../common/fragments/Carv2Checkbox";

interface Carv2SubmitCancelProps {
  onSubmit: () => void;
  onCancel: () => void;
  onChange: () => void;
}

export const Carv2SubmitCancel: FunctionComponent<Carv2SubmitCancelProps> = (
  props
) => {
  const { onCancel, onChange, onSubmit } = props;

  return (
    <div className="controllPanelEditChild">
      <Carv2Button icon="check" onClick={onSubmit} />
      <Carv2Button icon="times" onClick={onCancel} />
      <Carv2Checkbox label="Create another" onChange={onChange} />
    </div>
  );
};
