import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { Dropdown, Input } from "semantic-ui-react";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import {
  DataConnectionTO,
  Direction,
  RelationType,
} from "../../../../../dataAccess/access/to/DataConnectionTO";
import { selectDatas } from "../../../../metaDataModel/viewModel/MetaDataModelSlice";

export interface ControllPanelEditRelationProps {
  dataConnection: DataConnectionTO;
}

export const ControllPanelEditRelation: FunctionComponent<ControllPanelEditRelationProps> = (
  props
) => {
  const { dataConnection } = props;

  const datas: DataCTO[] = useSelector(selectDatas);
  //   const types: string[] = Object.values(RelationType);

  const setLabel1 = (event: any) => {
    dataConnection.label1 = event.target.value;
  };

  const dataToOption = (data: DataCTO) => {
    return {
      key: data.data.id,
      text: data.data.name,
      value: data.data.id,
    };
  };

  const getDirections = () => {
    return Object.entries(Direction).map(([key, value]) => ({
      key: key,
      text: key,
      value: value,
    }));
  };

  const getTypes = () => {
    return Object.entries(RelationType).map(([key, value]) => ({
      key: key,
      text: key,
      value: value,
    }));
  };

  return (
    <div>
      <Dropdown
        placeholder="Select Data1"
        selection
        options={datas.map(dataToOption)}
      />
      <Input placeholder="Label1" onChange={setLabel1} />
      <Dropdown placeholder="Select Type1" selection options={getTypes()} />
      {/* <Dropdown placeholder="Select Type1" selection /> */}
      <Dropdown
        placeholder="Select Direction1"
        selection
        options={getDirections()}
      />
      <br />
      <Dropdown
        placeholder="Select Data2"
        selection
        options={datas.map(dataToOption)}
      />
      <Input placeholder="Label2" onChange={setLabel1} />
      <Dropdown placeholder="Select Type2" selection options={getTypes()} />
      <Dropdown
        placeholder="Select Direction2"
        selection
        options={getDirections()}
      />
    </div>
  );
};
