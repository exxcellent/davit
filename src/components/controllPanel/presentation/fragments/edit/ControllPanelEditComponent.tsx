import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelCreate } from "./common/ControllPanelCreate";
import "./ControllPanelEdit.css";

export interface ControllPanelEditComponentProps {
  component: ComponentCTO;
}

export const ControllPanelEditComponent: FunctionComponent<ControllPanelEditComponentProps> = (
  props
) => {
  const { component } = props;
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);

  const switchIsCreateAnother = () => {
    setIsCreateAnother(!isCreateAnother);
  };

  const dispatch = useDispatch();

  const saveComponentChanges = (name: string) => {
    component.component.name = name;
    dispatch(ControllPanelActions.saveComponent(component));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    }
  };

  const cancelEditComponent = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  return (
    <ControllPanelCreate
      placeholder="Component name"
      onCancelCallBack={cancelEditComponent}
      onCreateCallBack={saveComponentChanges}
      setIsCreateAnother={switchIsCreateAnother}
    />
  );
};
