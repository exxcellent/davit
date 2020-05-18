import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "semantic-ui-react";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { Carv2Util } from "../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../common/fragments/buttons/Carv2DeleteButton";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { MetaDataActions } from "../../../../metaDataModel/viewModel/MetaDataActions";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "./common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "./common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "./common/fragments/Carv2SubmitCancel";
import "./ControllPanelEdit.css";

export interface ControllPanelEditDataProps {
  data: DataCTO;
}

export const ControllPanelEditData: FunctionComponent<ControllPanelEditDataProps> = (
  props
) => {
  const { data } = props;

  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const textInput = useRef<Input>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setName(data.data.name);
  }, [data.data.name]);

  const saveDataChanges = () => {
    let copyData: DataCTO = Carv2Util.deepCopy(data);
    copyData.data.name = name;
    setName("");
    dispatch(ControllPanelActions.saveData(copyData));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    } else {
      textInput.current!.focus();
    }
  };

  const cancelEditData = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  const deleteData = () => {
    dispatch(MetaDataActions.deleteData(data));
    cancelEditData();
  };

  return (
    <ControllPanelEditSub label="Create Data">
      <div />
      <div className="columnDivider">
        <Carv2LabelTextfield
          label="Name:"
          placeholder="Data Name"
          onChange={(event: any) => setName(event.target.value)}
          value={name}
          autoFocus
          ref={textInput}
        />
      </div>
      <Carv2SubmitCancel
        onSubmit={saveDataChanges}
        onCancel={cancelEditData}
        onChange={() => setIsCreateAnother(!isCreateAnother)}
      />
      <div className="controllPanelEditChild">
        {data.data.id !== -1 && <Carv2DeleteButton onClick={deleteData} />}
      </div>
    </ControllPanelEditSub>
  );
};
