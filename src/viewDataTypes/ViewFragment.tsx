import React from 'react';
import {ActorDataState} from './ActorDataState';


export interface ViewFragmentProps {
  parentId: number | { dataId: number; instanceId?: number };
  state: ActorDataState;
  name: string;
}

const getClassnameForViewFragmentState = (state: ActorDataState) => {
  return 'carv2ActorData' + state;
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
