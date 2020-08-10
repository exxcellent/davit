import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { DataInstanceTO } from "../../../../dataAccess/access/to/DataTO";
import { createViewFragment, ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";

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

  const createInstances = (instanceName: string, components: ViewFragmentProps[], key: number) => {
    return (
      <Card id="dataObject" key={key}>
        <Card.Content id="innerCard">{instanceName}</Card.Content>
        {components.map(
          (comp): JSX.Element => {
            return createViewFragment(comp, key);
          }
        )}
      </Card>
    );
  };

  if (instances.length > 0) {
    return (
      <div>
        <Card
          style={{ minWidth: initWidth, minHeigth: initHeigth, marginBottom: "0", fontSize: "0.7em" }}
          onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
          fluid
        >
          <Card.Content header={initName}></Card.Content>
        </Card>
        <div style={{ display: "flex", alignItems: "start" }}>
          {instances.map((instance, index) =>
            createInstances(
              instance.name,
              componentFragments.filter(
                (component) => (component.parentId as { dataId: number; instanceId: number }).instanceId === index
              ),
              index
            )
          )}
        </div>
      </div>
    );
  } else {
    return (
      <Card
        style={{ width: initWidth, height: initHeigth, marginBottom: "0", fontSize: "0.7em" }}
        onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
        fluid
      >
        <Card.Content header={initName}></Card.Content>
        {componentFragments.map(createViewFragment)}
      </Card>
    );
  }
};

export const createMetaDataFragment = (
  dataCTO: DataCTO,
  componentDatas: ViewFragmentProps[],
  onClick: (dataId: number) => void
) => {
  return (
    <MetaDataFragment
      id={dataCTO.data.id}
      initName={dataCTO.data.name}
      initWidth={dataCTO.geometricalData.geometricalData.width}
      initHeigth={dataCTO.geometricalData.geometricalData.height}
      componentFragments={componentDatas}
      instances={dataCTO.data.inst ? dataCTO.data.inst : []}
    />
  );
};
