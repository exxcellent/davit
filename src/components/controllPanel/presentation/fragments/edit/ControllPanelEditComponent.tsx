import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "semantic-ui-react";
import { ComponentCTO } from "../../../../../dataAccess/access/cto/ComponentCTO";
import { Carv2Util } from "../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../common/fragments/buttons/Carv2DeleteButton";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { MetaComponentActions } from "../../../../metaComponentModel/viewModel/MetaComponentActions";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "./common/ControllPanelEditSub";
import { Carv2LabelTextfield } from "./common/fragments/Carv2LabelTextfield";
import { Carv2SubmitCancel } from "./common/fragments/Carv2SubmitCancel";
import "./ControllPanelEdit.css";

export interface ControllPanelEditComponentProps {
  component: ComponentCTO;
}

export const ControllPanelEditComponent: FunctionComponent<ControllPanelEditComponentProps> = (
  props
) => {
  const { component } = props;
  const [name, setName] = useState<string>("");
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);

  const textInput = useRef<Input>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setName(component.component.name);
  }, [component]);

  const saveComponentChanges = () => {
    let copyComponent = Carv2Util.deepCopy(component);
    copyComponent.component.name = name;
    setName("");
    dispatch(ControllPanelActions.saveComponent(copyComponent));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    } else {
      textInput.current!.focus();
    }
  };

  const cancelEditComponent = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  const deleteComponent = () => {
    dispatch(MetaComponentActions.deleteComponent(component));
    cancelEditComponent();
  };

  return (
    <ControllPanelEditSub label="Create Component">
      <div />
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Component Name"
        onChange={(event: any) => setName(event.target.value)}
        value={name}
        autoFocus
        ref={textInput}
      />
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancel
          onSubmit={saveComponentChanges}
          onCancel={cancelEditComponent}
          onChange={() => setIsCreateAnother(!isCreateAnother)}
        />
      </div>
      {component.component.id !== -1 && (
        <div className="columnDivider">
          <div
            className="controllPanelEditChild"
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Carv2DeleteButton onClick={deleteComponent} />
          </div>
        </div>
      )}
    </ControllPanelEditSub>
  );
};
