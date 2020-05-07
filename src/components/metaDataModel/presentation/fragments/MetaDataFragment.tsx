import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Button, Card } from "semantic-ui-react";
import { ComponentDataCTO } from "../../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../../dataAccess/access/cto/SequenceStepCTO";
import {
  Mode,
  selectGlobalModeState,
} from "../../../common/viewModel/GlobalSlice";
import { DataFragmentProps } from "../../../metaComponentModel/presentation/fragments/DataFragment";

export interface MetaDataFragmentProps {
  id: number;
  initalName: string;
  initalWidth?: number;
  initalHeigth?: number;
  // componentFragments: ComponentFragmentProps[];
  // onDelCallBack: (id: number) => void;
}

export const MetaDataFragment: FunctionComponent<MetaDataFragmentProps> = (
  props
) => {
  const {
    // id,
    initalName,
    // onDelCallBack,
    // componentFragments,
    initalWidth,
    initalHeigth,
  } = props;

  console.log("Create Data Fragment!");

  const mode: Mode = useSelector(selectGlobalModeState);

  const delMetaComponentFragment = () => {
    // onDelCallBack(id);
  };

  return (
    <Card style={{ width: initalWidth, height: initalHeigth }}>
      <Card.Content header={initalName}></Card.Content>
      <Card.Content description="">
        {mode === Mode.EDIT && (
          <Button
            size="mini"
            icon="delete"
            onClick={delMetaComponentFragment}
          />
        )}
      </Card.Content>
      {/* {componentFragments.map(createDataFragment)} */}
    </Card>
  );
};

const stepToDataFragmentProps = (
  step: SequenceStepCTO | undefined,
  dataId: number
): DataFragmentProps[] => {
  const componentData: ComponentDataCTO[] = step
    ? step.componentDataCTOs.filter(
        (componentData) => componentData.dataTO.id === dataId
      )
    : [];
  return componentData.map((componentData) => {
    return {
      name: componentData.dataTO.name,
      state: componentData.componentDataTO.componentDataState,
    };
  });
};

export const createMetaDataFragment = (
  dataCTO: DataCTO,
  // onDeleteCallBack: (componentId: number) => void,
  step?: SequenceStepCTO
) => {
  return (
    <MetaDataFragment
      id={dataCTO.data.id}
      initalName={dataCTO.data.name}
      initalWidth={dataCTO.geometricalData.geometricalData.width}
      // componentFragments={stepToDataFragmentProps(
      //   step,
      //   componentDataCTO.componentTO.id
      // )}
    />
  );
};
