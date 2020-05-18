import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Input } from "semantic-ui-react";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import {
  DataConnectionTO,
  Direction,
  RelationType,
} from "../../../../../dataAccess/access/to/DataConnectionTO";
import { Carv2Util } from "../../../../../utils/Carv2Util";
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

  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);

  const [data1, setData1] = useState<number>(0);
  const [data2, setData2] = useState<number>(0);
  const [type1, setType1] = useState<RelationType>(RelationType.IN);
  const [type2, setType2] = useState<RelationType>(RelationType.OUT);
  const [label1, setLabel1] = useState<string>("");
  const [label2, setLabel2] = useState<string>("");
  const [direction1, setDirection1] = useState<Direction>(Direction.RIGHT);
  const [direction2, setDirection2] = useState<Direction>(Direction.LEFT);

  const dispatch = useDispatch();

  const cancelEditRelation = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  const saveRelation = () => {
    console.log("saving relation.");
    let copyRelation: DataConnectionTO = Carv2Util.deepCopy(dataConnection);
    copyRelation.data1Fk = data1;
    copyRelation.data2Fk = data2;
    copyRelation.type1 = type1;
    copyRelation.type2 = type2;
    copyRelation.label1 = label1;
    copyRelation.label2 = label2;
    copyRelation.direction1 = direction1;
    copyRelation.direction2 = direction2;
    dispatch(ControllPanelActions.saveDataConnection(copyRelation));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    } else {
      setData1(0);
      setData2(0);
      setType1(RelationType.IN);
      setType2(RelationType.OUT);
      setLabel1("");
      setLabel2("");
      setDirection1(Direction.RIGHT);
      setDirection2(Direction.LEFT);
    }
  };

  const datas: DataCTO[] = useSelector(selectDatas);
  //   const types: string[] = Object.values(RelationType);

  const setLabel = (event: any) => {
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
      <div />
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
              onChange={(event, data) => {
                setData1(Number(data.value));
              }}
            />
            <Dropdown
              placeholder="Select Type1"
              selection
              options={getTypes()}
              onChange={(event, data) => {
                setType1(RelationType[data.value as RelationType]);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Input
              placeholder="Label1"
              onChange={(event: any) => {
                setLabel1(event.target.value);
              }}
            />
            <Dropdown
              placeholder="Select Direction1"
              selection
              options={getDirections()}
              onChange={(event, data) => {
                setDirection1(Direction[data.value as Direction]);
              }}
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
              onChange={(event, data) => {
                setData2(Number(data.value));
              }}
            />
            <Dropdown
              placeholder="Select Type2"
              selection
              options={getTypes()}
              onChange={(event, data) => {
                setType2(RelationType[data.value as RelationType]);
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Input
              placeholder="Label2"
              onChangeCallBack={setLabel}
              onChange={(event: any) => {
                setLabel2(event.target.value);
              }}
            />
            <Dropdown
              placeholder="Select Direction2"
              selection
              options={getDirections()}
              onChange={(event, data) => {
                setDirection2(Direction[data.value as Direction]);
              }}
            />
          </div>
        </div>
      </div>
      <div className="columnDivider">
        <Carv2SubmitCancel
          onSubmit={saveRelation}
          onChange={() => setIsCreateAnother(!isCreateAnother)}
          onCancel={cancelEditRelation}
        />
      </div>
    </ControllPanelEditSub>
  );
};
