import React, { FunctionComponent } from "react";
import { DataInstanceTO } from "../../../../dataAccess/access/to/DataTO";
import { ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";

export interface MetaDataFragmentProps {
  id: number;
  initName: string;
  initWidth?: number;
  initHeigth?: number;
  instances: DataInstanceTO[];
  componentFragments: ViewFragmentProps[];
  onClick?: (dataId: number) => void;
}

const MetaDataFragment: FunctionComponent<MetaDataFragmentProps> = (props) => {
  const { initName, componentFragments, initWidth, initHeigth, instances } = props;

  return <div />;
};
