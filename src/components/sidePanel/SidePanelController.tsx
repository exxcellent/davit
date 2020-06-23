import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { Mode } from "../../slices/GlobalSlice";
import { SidePanelActions } from "./viewModel/SidePanelActions";

export interface SidePanelProps {}

export const SidePanelController: FunctionComponent<SidePanelProps> = (props) => {
  const dispatch = useDispatch();

  const setModeToEdit = () => {
    dispatch(SidePanelActions.setMode(Mode.EDIT));
  };

  const setModeToView = () => {
    dispatch(SidePanelActions.setMode(Mode.VIEW));
  };

  const setModeToFile = () => {
    dispatch(SidePanelActions.setMode(Mode.FILE));
  };

  return (
    <div className="leftPanel">
      <Button.Group basic vertical size="big" inverted color="orange">
        <Button inverted color="orange" icon="write" onClick={setModeToEdit} />
        <Button inverted color="orange" icon="eye" onClick={setModeToView} />
        <Button inverted color="orange" icon="file" onClick={setModeToFile} />
      </Button.Group>
    </div>
  );
};
