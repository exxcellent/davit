import React, { FunctionComponent } from 'react';

import { DataInstanceTO } from '../../../dataAccess/access/to/DataInstanceTO';
import { ViewFragmentProps } from '../../../viewDataTypes/ViewFragment';

export interface MetaDataFragmentProps {
  id: number;
  initName: string;
  initWidth?: number;
  initHeigth?: number;
  instances: DataInstanceTO[];
  actorFragments: ViewFragmentProps[];
  onClick?: (dataId: number) => void;
}

const MetaDataFragment: FunctionComponent<MetaDataFragmentProps> = (props) => {
  const { initName, actorFragments, initWidth, initHeigth, instances } = props;

  return <div />;
};
