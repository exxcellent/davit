import React from 'react';

import { ViewFragmentState } from './ViewFragmentState';

export interface ViewFragmentProps {
  parentId: number | { dataId: number; instanceId?: number };
  state: ViewFragmentState;
  name: string;
}

const getClassnameForViewFragmentState = (state: ViewFragmentState) => {
  return "carv2ActorData" + state;
};

export const createViewFragment = (actorDataFragmentProps: ViewFragmentProps, key: number) => {
  return (
    <div className="viewFragment" key={key}>
      <div className={getClassnameForViewFragmentState(actorDataFragmentProps.state)} key={key}>
        {actorDataFragmentProps.name}
      </div>
    </div>
  );
};
