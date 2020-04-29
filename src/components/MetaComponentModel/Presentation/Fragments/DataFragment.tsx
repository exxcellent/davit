import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { ComponentDataState } from "../../../../dataAccess/access/types/ComponentDataState";
import { Footer } from "../../../common/fragments/Footer";

export interface DataFragmentProps {
  state: ComponentDataState;
  name: string;
}

export const DataFragment: FunctionComponent<DataFragmentProps> = (props) => {
  const { name, state } = props;

  return <Data color={getColorForComponentDataState(state)}>{name}</Data>;
};

const getColorForComponentDataState = (state: ComponentDataState) => {
  switch (state) {
    case ComponentDataState.NEW:
      return "green";
    case ComponentDataState.PERSISTENT:
      return "blue";
    case ComponentDataState.DELETED:
      return "red";
    default:
      return "black";
  }
};

export const createDataFragment = (
  dataFragmentProps: DataFragmentProps,
  key: number
) => {
  console.info("create Data.");
  return (
    <Footer key={key}>
      <DataFragment key={key} {...dataFragmentProps} />
    </Footer>
  );
};

// Styling
const Data = styled.div`
  text-align: center;
  background-color: ${(props) => props.color};
`;
