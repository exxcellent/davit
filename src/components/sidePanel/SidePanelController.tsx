import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button } from "semantic-ui-react";
import { EditActions } from "../../slices/EditSlice";

export interface SidePanelProps {}

export const SidePanelController: FunctionComponent<SidePanelProps> = (props) => {
  const { setModeToEdit, setModeToFile, setModeToView } = useSidePanelViewModel();

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

const useSidePanelViewModel = () => {
  const dispatch = useDispatch();

  const setModeToEdit = () => {
    dispatch(EditActions.setMode.edit());
  };

  const setModeToView = () => {
    dispatch(EditActions.setMode.view());
  };

  const setModeToFile = () => {
    dispatch(EditActions.setMode.file());
  };

  return {
    setModeToEdit,
    setModeToView,
    setModeToFile,
  };
};
