import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { DataInstanceTO } from "../../../../dataAccess/access/to/DataTO";
import { createViewFragment, ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";

export interface MetaDataFragmentProps {
  id: number;
  initalName: string;
  initalWidth?: number;
  initalHeigth?: number;
  instances: DataInstanceTO[];
  componentFragments: ViewFragmentProps[];
  onClick?: (dataId: number) => void;
}

const MetaDataFragment: FunctionComponent<MetaDataFragmentProps> = (props) => {
  const { initalName, componentFragments, initalWidth, initalHeigth, instances } = props;

  const createInstances = (instanceName: string, components: ViewFragmentProps[], key: number) => {
    return (
      <Card
        // style={{ minWidth: initalWidth, minHeigth: initalHeigth, marginBottom: "0", fontSize: "0.7em" }}
        style={{
          width: "100px",
          height: "30px",
          textOverflow: "ellipsis",
          margin: "0",
          paddingTop: "0px !important",
          backgroundColor: "rgba(0,0,0,0.3)",
          color: "white",
        }}
        key={key}
      >
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
          style={{ minWidth: initalWidth, minHeigth: initalHeigth, marginBottom: "0", fontSize: "0.7em" }}
          // style={{ marginBottom: "0" }}
          onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
          fluid
        >
          <Card.Content header={initalName}></Card.Content>
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
        style={{ minWidth: initalWidth, minHeigth: initalHeigth, marginBottom: "0", fontSize: "0.7em" }}
        onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
        fluid
      >
        <Card.Content header={initalName}></Card.Content>
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
      initalName={dataCTO.data.name}
      initalWidth={dataCTO.geometricalData.geometricalData.width}
      initalHeigth={dataCTO.geometricalData.geometricalData.height}
      componentFragments={componentDatas}
      // onClick={onClick}
      instances={dataCTO.data.inst ? dataCTO.data.inst : []}
    />
  );
};
