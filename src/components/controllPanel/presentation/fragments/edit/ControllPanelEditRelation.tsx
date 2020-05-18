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
  const [type1, setType1] = useState<RelationType>(RelationType.DEFAULT);
  const [type2, setType2] = useState<RelationType>(RelationType.DEFAULT);

  const dispatch = useDispatch();
  const cancelEditRelation = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  const saveRelation = () => {
    let copyRelation: DataConnectionTO = Carv2Util.deepCopy(dataConnection);

    dispatch(ControllPanelActions.saveDataConnection(copyRelation));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    } else {
      // TODO: clean feelds.
    }
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
              onChange={(event, data) => {
                setData2(Number(data.value));
              }}
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
      <div className="columnDivider">
        <Carv2SubmitCancel
          onSubmit={() => saveRelation}
          onChange={() => setIsCreateAnother(!isCreateAnother)}
          onCancel={cancelEditRelation}
        />
      </div>
    </ControllPanelEditSub>
  );
};
