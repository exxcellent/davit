import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-svg-core";

export interface CarvButtonProps {
  name: string;
  onClickCallback: () => void;
  icon?: IconName;
}

export const CarvButton: FunctionComponent<CarvButtonProps> = (props) => {
  const { name, icon, onClickCallback } = props;
  let value = icon !== undefined ? <FontAwesomeIcon icon={icon!} /> : name;
  return <Button onClick={onClickCallback}>{value}</Button>;
};

// Styling
const Button = styled.button`
  background: #3498db;
  color: #fff;
  border-radius: 3px;
  font-family: ${(props) => props.theme.fontFamily};
  :hover {
    background: #2980b9;
  }
`;
