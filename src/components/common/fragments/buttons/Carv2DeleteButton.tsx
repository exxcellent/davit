import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";

interface Carv2DeleteButtonProps {
  onClick: () => void;
}

export const Carv2DeleteButton: FunctionComponent<Carv2DeleteButtonProps> = (
  props
) => {
  const { onClick } = props;

  return (
    <Button
      icon="trash alternate"
      onClick={onClick}
      className="carv2Button"
      inverted
      color="red"
    />
  );
};
