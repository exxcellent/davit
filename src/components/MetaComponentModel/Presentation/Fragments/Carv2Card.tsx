import React, { FunctionComponent } from "react";
import { DataInstanceTO } from "../../../../dataAccess/access/to/DataTO";
import { createViewFragment, ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";

export interface Carv2CardProps {
  id: number;
  initName: string;
  initWidth: number;
  initHeigth: number;
  dataFragments: ViewFragmentProps[];
  instances?: DataInstanceTO[];
  zoomFactor: number;
  onClick?: (id: number) => void;
}

export const Carv2Card: FunctionComponent<Carv2CardProps> = (props) => {
  const { id, initName, initWidth, initHeigth, dataFragments, instances, zoomFactor } = props;

  const createInstances = (id: number, instanceName: string, components: ViewFragmentProps[]) => {
    return (
      <Carv2Card
        id={id}
        initName={instanceName}
        dataFragments={components}
        initWidth={initWidth}
        initHeigth={initHeigth}
        zoomFactor={zoomFactor}
      />
    );
  };

  return (
    <div
      className="metaComponent"
      style={{ minWidth: initWidth * zoomFactor, minHeight: initHeigth * zoomFactor, fontSize: `${1 * zoomFactor}em` }}
      onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
      key={id}
    >
      <div className="metaComponentHeader">{initName}</div>
      {instances && (
        <div style={{ display: "flex", alignItems: "start" }}>
          {instances.map((instance, index) =>
            createInstances(
              id * 1000 + index,
              instance.name,
              dataFragments.filter(
                (component) => (component.parentId as { dataId: number; instanceId: number }).instanceId === index
              )
            )
          )}
        </div>
      )}
      {(instances === undefined || instances?.length === 0) && dataFragments.map(createViewFragment)}
    </div>
  );
};
