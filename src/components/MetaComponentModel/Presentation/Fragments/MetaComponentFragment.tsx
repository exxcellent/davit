import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { CarvButton } from "../../../common/styles/Button";

interface MetaComponentFragmentProps {
  name: string;
  id: string;
  width: number;
  heigth: number;
  color: string;
  editCallBack: () => void;
}

export const MetaComponentFragment: FunctionComponent<MetaComponentFragmentProps> = (
  props
) => {
  const { name, width, heigth, color, id, editCallBack } = props;

  // Styling
  const MetaComponent = styled.div`
    padding: 10px;
    width: ${width}em;
    height: ${heigth}em;
    background-color: ${color};
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
