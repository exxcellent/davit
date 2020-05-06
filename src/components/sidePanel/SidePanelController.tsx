import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { Mode } from "../common/viewModel/GlobalSlice";
import { SidePanelActions } from "./viewModel/SidePanelActions";

export interface SidePanelProps {}

export const SidePanelController: FunctionComponent<SidePanelProps> = (
  props
) => {
  const dispatch = useDispatch();

  const setModeToEdit = () => {
    dispatch(SidePanelActions.setMode(Mode.EDIT));
  };

  const setModeToView = () => {
    dispatch(SidePanelActions.setMode(Mode.VIEW));
  };

  return (
    <div className="leftPanel">
      <Button.Group basic vertical size="big">
        <Button icon="write" onClick={setModeToEdit} />
        <Button icon="eye" onClick={setModeToView} />
      </Button.Group>
    </div>
  );
};
