import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Footer } from "../../../common/fragments/Footer";

export interface DataFragmentProps {
  color: string;
  name: string;
}

export const DataFragment: FunctionComponent<DataFragmentProps> = (props) => {
  const { color, name } = props;

  return <Data color={color}>{name}</Data>;
};

export const createDataFragment = (
  dataFragmentProps: DataFragmentProps,
  key: number
) => {
  console.info("create Data.");
  return (
    <Footer key={key}>
      <DataFragment
        key={key}
        name={dataFragmentProps.name}
        color={dataFragmentProps.color}
      />
    </Footer>
  );
};

// Styling
const Data = styled.div`
  text-align: center;
  background-color: ${(props) => props.color};
`;
