import React, { FunctionComponent } from "react";
import { Carv2Button } from "./Carv2Button";

interface Carv2AddButtonProps {
  onClick: () => void;
}

export const Carv2AddButton: FunctionComponent<Carv2AddButtonProps> = (
  props
) => {
  const { onClick } = props;

  return <Carv2Button icon="add" onClick={onClick} />;
};
