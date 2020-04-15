import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { CarvButton } from "../../../common/styles/Button";

export interface MetaComponentFragmentProps {
  name: string;
  id: number;
  editCallBack: () => void;
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = (
  props
) => {
  const { name, id, editCallBack } = props;

  // Styling
  const MetaComponent = styled.div`
    padding: 10px;
    width: 10em;
    height: 10em;
    background-color: ${(props) => props.theme.backgroundcolor};
    border-radius: ${(props) => props.theme.borderRadius.popup};
  `;

  return (
    <MetaComponent>
      <CarvButton
        name="Add button"
        icon="plus-square"
        onClickCallback={editCallBack}
      />
      <label>{name}</label>
      <CarvButton
        name="Edit Button"
        icon="ellipsis-h"
        onClickCallback={editCallBack}
      />
      <label>ID: {id}</label>
    </MetaComponent>
  );
};
