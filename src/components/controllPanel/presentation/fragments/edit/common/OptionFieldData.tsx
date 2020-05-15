import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";
import "./OptionField.css";

export interface OptionFieldDataProps {
  onAddButtonCallBack: Function;
  onEditButtonCallBack: Function;
  onEditRelationCallBack: Function;
  label: string;
}

export const OptionFieldData: FunctionComponent<OptionFieldDataProps> = (
  props
) => {
  const {
    onAddButtonCallBack,
    onEditButtonCallBack,
    onEditRelationCallBack,
    label,
  } = props;

  return (
    <div>
      <div className="optionField">
        <Button
          inverted
          color="orange"
          icon="add"
          onClick={() => onAddButtonCallBack()}
        />
        <Button inverted color="orange" icon="wrench" onClick={() => {}} />
        <Button
          inverted
          color="orange"
          icon="arrows alternate horizontal"
          onClick={() => onEditRelationCallBack()}
        />
      </div>
      <div style={{ textAlign: "center", color: "white" }}>
        {label.toUpperCase()}
      </div>
    </div>
  );
};
