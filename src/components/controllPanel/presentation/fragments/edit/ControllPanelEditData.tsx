import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { Button, Input } from "semantic-ui-react";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import "./ControllPanelEdit.css";

export interface ControllPanelEditDataProps {
  data: DataCTO;
}

export const ControllPanelEditData: FunctionComponent<ControllPanelEditDataProps> = (
  props
) => {
  const { data } = props;

  const dispatch = useDispatch();

  const setDataName = (event: any) => {
    data.data.name = event.target.value;
  };

  const saveDataChanges = () => {
    dispatch(ControllPanelActions.saveData(data));
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  const cancelEditData = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  return (
    <div className="controllPanelEdit">
      <div className="controllPanelEditChild">
        <Input label="Name: " placeholder="Dataname" onChange={setDataName} />
      </div>
      <div className="controllPanelEditChild">
        <Button icon="times" onClick={cancelEditData} />
        <Button icon="check" onClick={saveDataChanges} />
      </div>
    </div>
  );
};
