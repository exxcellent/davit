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

  // const [dataToEdit, setDataToEdit] = useState<DataCTO>(new DataCTO());
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("Create Data");
  const textInput = useRef<Input>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.data.id !== -1) {
      setLabel("Edit Data");
    }
  }, [data]);

  const setDataToEdit = (dataToEdit: DataCTO | null) => {
    dispatch(ControllPanelActions.setDataToEdit(dataToEdit));
  };

  const saveDataChanges = () => {
    dispatch(ControllPanelActions.saveData(Carv2Util.deepCopy(data)));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setDataToEdit(null));
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    } else {
      dispatch(ControllPanelActions.setDataToEdit(new DataCTO()));
      textInput.current!.focus();
    }
  };

  const cancelEditData = () => {
    dispatch(ControllPanelActions.cancelEditData());
  };

  const deleteData = () => {
    dispatch(ControllPanelActions.setDataToEdit(null));
    dispatch(MetaDataActions.deleteData(data));
    cancelEditData();
  };

  return (
    <ControllPanelEditSub label={label}>
      <div />
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Data Name"
        onChange={(event: any) =>
          setDataToEdit({
            ...data,
            data: { ...data.data, name: event.target.value },
          })
        }
        value={data.data.name}
        autoFocus
        ref={textInput}
      />
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancel
          onSubmit={saveDataChanges}
          onCancel={cancelEditData}
          onChange={() => setIsCreateAnother(!isCreateAnother)}
        />
      </div>
      {data.data.id !== -1 && (
        <div className="columnDivider">
          <div
            className="controllPanelEditChild"
            style={{ display: "felx", alignItems: "center", height: "100%" }}
          >
            <Carv2DeleteButton onClick={deleteData} />
          </div>
        </div>
      )}
    </ControllPanelEditSub>
  );
};
