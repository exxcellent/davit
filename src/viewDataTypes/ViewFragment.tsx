import React from "react";
import { ViewFragmentState } from "./ViewFragmentState";

export interface ViewFragmentProps {
  parentId: number | { dataId: number; instanceId?: number };
  state: ViewFragmentState;
  name: string;
}

const getClassnameForViewFragmentState = (state: ViewFragmentState) => {
  return "carv2ComponentData" + state;
};

export const createViewFragment = (componentDataFragmentProps: ViewFragmentProps, key: number) => {
  return (
    <div className="viewFragment" key={key}>
      <div className={getClassnameForViewFragmentState(componentDataFragmentProps.state)} key={key}>
        {componentDataFragmentProps.name}
      </div>
    </div>
  );
};
