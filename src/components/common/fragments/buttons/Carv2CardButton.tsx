import React, { FunctionComponent } from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";

interface Carv2CardButtonProps {
  onClick: () => void;
  disable?: boolean;
  icon?: SemanticICONS;
  isActive?: boolean
}

export const Carv2CardButton: FunctionComponent<Carv2CardButtonProps> = (props) => {
  const { onClick, disable, icon, isActive } = props;

  return <div onClick={onClick} className={"Carv2CardButton" + (isActive ? " activeButton" : "")} ><Icon size="small" name={icon} /></div>;
};
