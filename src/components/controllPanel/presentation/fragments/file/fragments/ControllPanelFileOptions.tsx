import React, { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { ButtonGroup } from "semantic-ui-react";
import { EditActions } from "../../../../../../slices/EditSlice";
import { GlobalActions } from "../../../../../../slices/GlobalSlice";
import { Carv2Button } from "../../../../../common/fragments/buttons/Carv2Button";
import { Carv2FileInput } from "../../../../../common/fragments/buttons/Carv2FileInput";

export interface ControllPanelFileOptionsProps {}

export const ControllPanelFileOptions: FunctionComponent<ControllPanelFileOptionsProps> = (props) => {
  const { downloadData, deleteLocalStorage } = useFileOptionModelView();

  return (
    <div>
      <div className="optionField">
        <ButtonGroup>
          <Carv2FileInput />
          <Carv2Button icon="download" onClick={downloadData} />
          <Carv2Button icon="edit" onClick={deleteLocalStorage} />
        </ButtonGroup>
      </div>
      <div style={{ textAlign: "center", color: "white" }}>{"file".toUpperCase()}</div>
    </div>
  );
};

const useFileOptionModelView = () => {
  const dispatch = useDispatch();

  const deleteLocalStorage = () => {
    dispatch(EditActions.setMode.view());
    dispatch(GlobalActions.storefileData("{}"));
  };

  const downloadData = () => {
    dispatch(GlobalActions.downloadData());
  };

  return { deleteLocalStorage, downloadData };
};
