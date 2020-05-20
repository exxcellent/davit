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
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("Create Component");
  const textInput = useRef<Input>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (component.component.id !== -1) {
      setLabel("Edit Component");
    }
  }, [component]);

  const setComponentToEdit = (componentToEdit: ComponentCTO | null) => {
    dispatch(ControllPanelActions.setComponentToEdit(componentToEdit));
  };

  const saveComponentChanges = () => {
    dispatch(ControllPanelActions.saveComponent(Carv2Util.deepCopy(component)));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setComponentToEdit(null));
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    } else {
      dispatch(ControllPanelActions.setComponentToEdit(new ComponentCTO()));
      textInput.current!.focus();
    }
  };

  const cancelEditComponent = () => {
    dispatch(ControllPanelActions.cancelEditComponent());
  };

  const deleteComponent = () => {
    dispatch(ControllPanelActions.setComponentToEdit(null));
    dispatch(MetaComponentActions.deleteComponent(component));
    cancelEditComponent();
  };

  return (
    <ControllPanelEditSub label={label}>
      <div />
      <Carv2LabelTextfield
        label="Name:"
        placeholder="Component Name"
        onChange={(event: any) =>
          setComponentToEdit({
            ...component,
            component: { ...component.component, name: event.target.value },
          })
        }
        value={component.component.name}
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
