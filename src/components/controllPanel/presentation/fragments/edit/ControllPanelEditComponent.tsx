import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import "./ControllPanelEdit.css";

export interface ControllPanelEditComponentProps {
  component: ComponentCTO;
}

export const ControllPanelEditComponent: FunctionComponent<ControllPanelEditComponentProps> = (
  props
) => {
  const { component } = props;

  const dispatch = useDispatch();

  const setComponentName = (event: any) => {
    component.component.name = event.target.value;
  };

  const saveComponentChanges = () => {
    dispatch(ControllPanelActions.saveComponent(component));
  };

  const cancelEditComponent = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  return (
    <div className="controllPanelEdit">
      <div className="controllPanelEditChild">
        <Input
          label="Name: "
          placeholder="Componentname"
          onChange={setComponentName}
        />
      </div>
      <div className="controllPanelEditChild">
        <Button icon="times" onClick={() => cancelEditComponent} />
        <Button icon="check" onClick={() => saveComponentChanges} />
      </div>
    </div>
  );
};
