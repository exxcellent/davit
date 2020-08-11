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
//   const createInstances = (id: number, instanceName: string, components: ViewFragmentProps[]) => {
//     return <Carv2Card id={id} initName={instanceName} dataFragments={components} />;
//   };

//   if (instances.length > 0) {
//     return (
//       <div>
//         <Card
//           style={{ minWidth: initWidth, minHeigth: initHeigth, marginBottom: "0", fontSize: "0.7em" }}
//           onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
//           fluid
//         >
//           <Card.Content header={initName}></Card.Content>
//         </Card>

//         <div style={{ display: "flex", alignItems: "start" }}>
//           {instances.map((instance, index) =>
//             createInstances(
//               instance.name,
//               componentFragments.filter(
//                 (component) => (component.parentId as { dataId: number; instanceId: number }).instanceId === index
//               ),
//               index
//             )
//           )}
//         </div>
//       </div>
//     );
//   } else {
//     return (
//       <Card
//         style={{ width: initWidth, height: initHeigth, marginBottom: "0", fontSize: "0.7em" }}
//         onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
//         fluid
//       >
//         <Card.Content header={initName}></Card.Content>
//         {componentFragments.map(createViewFragment)}
//       </Card>
//     );
//   }
// };
