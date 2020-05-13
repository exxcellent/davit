import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";

export interface OptionFieldProps {
  title: string;
  onAddButtonCallBack: Function;
  onEditButtonCallBack: Function;
}

export const OptionField: FunctionComponent<OptionFieldProps> = (props) => {
  const { title, onAddButtonCallBack, onEditButtonCallBack } = props;

  return (
    <div className="controllPanelEditChild">
      <label>{title}</label>
      <br />
      <Button icon="add" onClick={() => onAddButtonCallBack()} />
    </div>
  );
};
