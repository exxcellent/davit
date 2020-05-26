import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItemProps } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { Carv2DeleteButton } from "../../../../common/fragments/buttons/Carv2DeleteButton";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { selectDatas } from "../../../../metaDataModel/viewModel/MetaDataModelSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "./common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "./common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "./common/fragments/Carv2SubmitCancel";
import "./ControllPanelEdit.css";

export interface ControllPanelEditComponentDataProps {
  component: ComponentCTO | null;
}

export const ControllPanelEditComponentData: FunctionComponent<ControllPanelEditComponentDataProps> = (
  props
) => {
  const { component } = props;

  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("Add Data");
  // const textInput = useRef<Input>(null);
  const dispatch = useDispatch();
  const datas: DataCTO[] = useSelector(selectDatas);

  useEffect(() => {}, [component]);

  const dataToOption = (data: DataCTO): DropdownItemProps => {
    return {
      key: data.data.id,
      value: data.data.id,
      text: data.data.name,
    };
  };

  const selectData = (id: number) => {
    // onSelect(datas.find((data) => data.data.id === id));
  };

  const cancelEditComponentData = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT_SEQUENCE_STEP));
  };

  return (
    <ControllPanelEditSub label={label}>
      <Carv2LabelTextfield
        label="Component:"
        value={component?.component.name}
      />
      <div className="optionFieldSpacer columnDivider">
        <Dropdown
          placeholder="Select Data"
          fluid
          multiple
          search
          selection
          options={datas.map(dataToOption)}
        />
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2SubmitCancel
          onSubmit={() => {}}
          onCancel={cancelEditComponentData}
          onChange={() => setIsCreateAnother(!isCreateAnother)}
        />
      </div>
      <div className="columnDivider controllPanelEditChild">
        <Carv2DeleteButton onClick={() => {}} />
      </div>
    </ControllPanelEditSub>
  );
};
