import React, { FunctionComponent, useState } from "react";
import { Button } from "semantic-ui-react";

interface Carv2DeleteButtonProps {
  onClick: () => void;
}

export const Carv2DeleteButton: FunctionComponent<Carv2DeleteButtonProps> = (props) => {
  const { onClick } = props;

  const [fluid, setFluid] = useState<boolean>(false);

  const onButtonClick = () => {
    setFluid(true);
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        paddingRight: "10px",
      }}
    >
      {!fluid && <Button icon="trash alternate" onClick={onButtonClick} className="carv2Button" inverted color="red" />}
      {fluid && (
        <Button onClick={onClick} className="carv2Button" inverted color="red" fluid>
          SURE?
        </Button>
      )}
    </div>
  );
};
