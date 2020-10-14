import React, { PropsWithChildren } from 'react';

interface Option<T> {
  value: T;
  label: string;
}

interface DropDownProps<T> {
  options: Option<T>[];
  onSelect: (value: T) => void;
}

export const DropDown = <T,>(props: PropsWithChildren<DropDownProps<T>>) => {
  const { options, onSelect } = props;

  return (
    <select className="carv2DropDown">
      {options.map((option, index) => (
        <option
          className="carv2DropDownOptions"
          id="option"
          onClick={() => {
            onSelect(option.value);
          }}
          key={index}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};
