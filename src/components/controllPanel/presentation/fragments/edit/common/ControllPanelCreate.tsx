import React, { FunctionComponent, useState } from "react";
import { Button, Checkbox, Input } from "semantic-ui-react";

export interface ControllPanelCreateProps {
  placeholder: string;
  onCreateCallBack: Function;
  onCancelCallBack: Function;
  setIsCreateAnother: Function;
}

export const ControllPanelCreate: FunctionComponent<ControllPanelCreateProps> = (
  props
) => {
  const {
    placeholder,
    onCreateCallBack,
    onCancelCallBack,
    setIsCreateAnother,
  } = props;

  const [name, setName] = useState<string>("");

  const updateName = (event: any) => {
    setName(event.target.value);
  };

  const onCreate = () => {
    onCreateCallBack(name);
    setName("");
  };

  return (
    <div className="controllPanelEdit">
      <div className="controllPanelEditChild">
        <Input
          label="Name: "
          placeholder={placeholder}
          onChange={updateName}
          value={name}
          autoFocus
        />
        <Button icon="times" onClick={() => onCancelCallBack()} />
        <Button icon="check" onClick={onCreate} />
        <Checkbox
          label="Create another"
          onChange={() => setIsCreateAnother()}
        />
      </div>
    </div>
  );
};
