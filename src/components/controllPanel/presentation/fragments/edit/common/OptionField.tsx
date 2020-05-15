import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";
import "./OptionField.css";

export interface OptionFieldProps {
  onAddButtonCallBack: Function;
  onEditButtonCallBack: Function;
  label: string;
}

export const OptionField: FunctionComponent<OptionFieldProps> = (props) => {
  const { onAddButtonCallBack, onEditButtonCallBack, label } = props;

  return (
    <div>
      <div className="optionField">
        <Button
          inverted
          color="orange"
          icon="add"
          onClick={() => onAddButtonCallBack()}
        />
        <Button
          inverted
          color="orange"
          icon="wrench"
          onClick={() => onEditButtonCallBack()}
        />
      </div>
      <div style={{ textAlign: "center", color: "white" }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
};
