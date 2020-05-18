import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Input } from "semantic-ui-react";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import {
  DataConnectionTO,
  Direction,
  RelationType,
} from "../../../../../dataAccess/access/to/DataConnectionTO";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { selectDatas } from "../../../../metaDataModel/viewModel/MetaDataModelSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "./common/ControllPanelEditSub";
import { Carv2SubmitCancel } from "./common/fragments/Carv2SubmitCancel";

export interface ControllPanelEditRelationProps {
  dataConnection: DataConnectionTO;
}

export const ControllPanelEditRelation: FunctionComponent<ControllPanelEditRelationProps> = (
  props
) => {
  const { dataConnection } = props;

  const [isAnother, setIsAnother] = useState<boolean>(true);

  const dispatch = useDispatch();
  const cancelEditRelation = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };
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
    <ControllPanelEditSub label="Edit Data Relation">
      <div className="columnDivider" />
      <div
        className="columnDivider"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Dropdown
              placeholder="Select Data1"
              selection
              options={datas.map(dataToOption)}
            />
            <Dropdown
              placeholder="Select Type1"
              selection
              options={getTypes()}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Input placeholder="Label1" onChangeCallBack={setLabel1} />
            <Dropdown
              placeholder="Select Direction1"
              selection
              options={getDirections()}
            />
          </div>
        </div>
      </div>
      <div
        className="columnDivider"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Dropdown
              placeholder="Select Data2"
              selection
              options={datas.map(dataToOption)}
            />
            <Dropdown
              placeholder="Select Type2"
              selection
              options={getTypes()}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Input placeholder="Label2" onChangeCallBack={setLabel1} />
            <Dropdown
              placeholder="Select Direction2"
              selection
              options={getDirections()}
            />
          </div>
        </div>
      </div>
      <Carv2SubmitCancel
        onSubmit={() => {}}
        onChange={() => setIsAnother(!isAnother)}
        onCancel={cancelEditRelation}
      />
    </ControllPanelEditSub>
  );
};
