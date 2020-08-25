import React, { FunctionComponent } from "react";
import { Icon } from "semantic-ui-react";

interface Carv2CardMainButtonProps {
  onClick: () => void;
  disable?: boolean;
}

export const Carv2CardMainButton: FunctionComponent<Carv2CardMainButtonProps> = (props) => {
  const { onClick, disable } = props;

  return <div onClick={onClick} className="Carv2CardMainButton" ><Icon name='caret up' size='tiny' /></div>;
};
