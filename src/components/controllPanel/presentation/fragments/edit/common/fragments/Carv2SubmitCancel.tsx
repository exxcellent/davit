import React, { FunctionComponent, useEffect, useState } from "react";
import { Carv2Button } from "../../../../../../common/fragments/buttons/Carv2Button";
import { Carv2Checkbox } from "../../../../../../common/fragments/Carv2Checkbox";

interface Carv2SubmitCancelProps {
  onSubmit: () => void;
  onCancel: () => void;
  onChange: () => void;
  toggleLabel?: string;
  submitCondition?: boolean;
  checked?: boolean;
}

export const Carv2SubmitCancel: FunctionComponent<Carv2SubmitCancelProps> = (props) => {
  const { onCancel, onChange, onSubmit, submitCondition, toggleLabel, checked } = props;

  const [disable, setDisable] = useState<boolean>(false);
  const [label, setToggleLabel] = useState<string>("Create another");

  useEffect(() => {
    if (submitCondition === undefined) {
      setDisable(false);
    } else {
      setDisable(!submitCondition);
    }
    if (toggleLabel !== undefined) {
      setToggleLabel(toggleLabel);
    }
  }, [submitCondition, toggleLabel]);

  return (
    <div className="controllPanelEditChild">
      <Carv2Button icon="check" onClick={onSubmit} disable={disable} />
      <Carv2Button icon="times" onClick={onCancel} />
      <Carv2Checkbox label={label} onChange={onChange} checked={checked} />
    </div>
  );
};

export const Carv2SubmitCancelNoCheckBox: FunctionComponent<Carv2SubmitCancelProps> = (props) => {
  const { onCancel, onSubmit, submitCondition } = props;

  const [disable, setDisable] = useState<boolean>(false);

  useEffect(() => {
    if (submitCondition === undefined) {
      setDisable(false);
    } else {
      setDisable(!submitCondition);
    }
  }, [submitCondition]);

  return (
    <div className="controllPanelEditChild">
      <Carv2Button icon="check" onClick={onSubmit} disable={disable} />
      <Carv2Button icon="times" onClick={onCancel} />
    </div>
  );
};
