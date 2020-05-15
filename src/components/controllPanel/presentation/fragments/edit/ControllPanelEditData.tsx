import React, { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelCreate } from "./common/ControllPanelCreate";
import "./ControllPanelEdit.css";

export interface ControllPanelEditDataProps {
  data: DataCTO;
}

export const ControllPanelEditData: FunctionComponent<ControllPanelEditDataProps> = (
  props
) => {
  const { data } = props;

  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(false);

  const switchIsCreateAnother = () => {
    setIsCreateAnother(!isCreateAnother);
  };

  const dispatch = useDispatch();

  const saveDataChanges = (name: string) => {
    data.data.name = name;
    dispatch(ControllPanelActions.saveData(data));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    }
  };

  const cancelEditData = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  return (
    <ControllPanelCreate
      placeholder="Data name"
      onCancelCallBack={cancelEditData}
      onCreateCallBack={saveDataChanges}
      setIsCreateAnother={switchIsCreateAnother}
    />
  );
};
