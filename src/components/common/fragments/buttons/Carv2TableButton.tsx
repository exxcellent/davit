import React, {FunctionComponent} from 'react';
import {Button, IconProps, SemanticShorthandItem} from 'semantic-ui-react';

interface Carv2TableButtonProps {
  onClick: () => void;
  disable?: boolean;
  icon?: SemanticShorthandItem<IconProps>;
}

export const Carv2TableButton: FunctionComponent<Carv2TableButtonProps> = (props) => {
  const {onClick, icon, disable} = props;

  return <Button icon={icon} onClick={onClick} className="carv2TableButton" inverted color="orange" disabled={disable} />;
};
