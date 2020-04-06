import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Futter } from "../../../common/Futter";

export interface MetaComponentAddPopupProps {}

export const MetaComponentAddPopup: FunctionComponent<MetaComponentAddPopupProps> = props => {
  const onClickOk = () => {
    console.log("clicked 'OK' Button.");
  };

  const onClickCancel = () => {
    console.log("clicked 'Cancel' Button.");
  };

  return (
    <div>
      <Popup>
        <header>
          <label>Popup</label>
        </header>

        <Futter>
          <button onClick={onClickCancel}>Cancel</button>
          <button onClick={onClickOk}>OK</button>
        </Futter>
      </Popup>
    </div>
  );
};

// Styling
const Popup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  width: 10em;
  height: 20em;
  text-align: center;
  border-radius: ${props => props.theme.borderRadius.popup};
  background-color: ${props => props.theme.color.primary};
`;
