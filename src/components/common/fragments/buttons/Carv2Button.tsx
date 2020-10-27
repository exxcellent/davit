import React, { FunctionComponent } from "react";
import { Button } from "semantic-ui-react";

interface Carv2ButtonIconProps {
  onClick: () => void;
  icon?: string;
  disable?: boolean;
}

interface Carv2ButtonLabelProps {
  onClick: () => void;
  label: string;
  disable?: boolean;
}

export const Carv2ButtonIcon: FunctionComponent<Carv2ButtonIconProps> = (props) => {
  const { onClick, icon, disable } = props;

  return <Button icon={icon} onClick={onClick} className="carv2Button" inverted color="orange" disabled={disable} />;
};

export const Carv2ButtonLabel: FunctionComponent<Carv2ButtonLabelProps> = (props) => {
  const { onClick, label, disable } = props;

  return (
    <Button onClick={onClick} inverted color="orange" disabled={disable}>
      {label}
    </Button>
  );
};
