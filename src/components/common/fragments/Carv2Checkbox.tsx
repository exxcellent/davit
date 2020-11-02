import React, {FunctionComponent} from 'react';
import {Checkbox} from 'semantic-ui-react';

export interface Carv2CheckboxProps {
  onChange: () => void;
  label: string;
  checked?: boolean;
}

export const Carv2Checkbox: FunctionComponent<Carv2CheckboxProps> = (props) => {
  const {onChange, label, checked} = props;

  return (
    <div style={{display: 'flex'}}>
      <Checkbox onChange={onChange} toggle defaultChecked={checked ? checked : false} />
      <label className="carv2label pLeft1">{label}</label>
    </div>
  );
};
