import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";

interface Carv2ButtonProps {
  onClick: () => void;
  icon?: string;
  disable?: boolean;
}

export const Carv2Button: FunctionComponent<Carv2ButtonProps> = (props) => {
  const { onClick, icon, disable } = props;

  return <Button icon={icon} onClick={onClick} className="carv2Button" inverted color="orange" disabled={disable} />;
};
