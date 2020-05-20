import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Input } from "semantic-ui-react";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../dataAccess/access/cto/DataRelationCTO";
import {
  DataRelationTO,
  Direction,
  RelationType,
} from "../../../../../dataAccess/access/to/DataRelationTO";
import { Carv2Util } from "../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../common/fragments/buttons/Carv2DeleteButton";
import { Mode } from "../../../../common/viewModel/GlobalSlice";
import { selectDatas } from "../../../../metaDataModel/viewModel/MetaDataModelSlice";
import { ControllPanelActions } from "../../../viewModel/ControllPanelActions";
import { ControllPanelEditSub } from "./common/ControllPanelEditSub";
import { Carv2SubmitCancel } from "./common/fragments/Carv2SubmitCancel";

export interface ControllPanelEditRelationProps {
  dataRelation: DataRelationCTO;
}

export const ControllPanelEditRelation: FunctionComponent<ControllPanelEditRelationProps> = (
  props
) => {
  const { dataRelation } = props;

  const datas: DataCTO[] = useSelector(selectDatas);
  const [isCreateAnother, setIsCreateAnother] = useState<boolean>(true);

  const [dataRelationCopy, setDataRelationCopy] = useState<DataRelationTO>(
    new DataRelationTO()
  );

  useEffect(() => {
    setDataRelationCopy({ ...dataRelation.dataRelationTO });
  }, [dataRelation]);

  const dispatch = useDispatch();

  const cancelEditRelation = () => {
    dispatch(ControllPanelActions.setMode(Mode.EDIT));
  };

  const saveRelation = () => {
    // TODO Felder validieren.
    console.log("saving relation.");
    let copyRelation: DataRelationCTO = Carv2Util.deepCopy(dataRelation);
    copyRelation.dataRelationTO = dataRelationCopy;
    copyRelation.dataCTO1 = datas.find(
      (data) => data.data.id === dataRelationCopy.data1Fk
    )!;
    copyRelation.dataCTO2 = datas.find(
      (data) => data.data.id === dataRelationCopy.data2Fk
    )!;
    dispatch(ControllPanelActions.saveDataConnection(copyRelation));
    if (!isCreateAnother) {
      dispatch(ControllPanelActions.setMode(Mode.EDIT));
    } else {
      setDataRelationCopy(new DataRelationTO());
    }
  };

  const deleteRelation = () => {
    dispatch(ControllPanelActions.deleteRelation(dataRelation));
    cancelEditRelation();
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
                setDataRelationCopy({
                  ...dataRelationCopy,
                  data1Fk: Number(data.value),
                });
              }}
              value={
                dataRelationCopy.data1Fk === -1
                  ? undefined
                  : dataRelationCopy.data1Fk
              }
            />
            <Dropdown
              placeholder="Select Type1"
              selection
              options={getTypes()}
              onChange={(event, data) => {
                setDataRelationCopy({
                  ...dataRelationCopy,
                  type1: RelationType[data.value as RelationType],
                });
              }}
              value={dataRelationCopy.type1}
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
                setDataRelationCopy({
                  ...dataRelationCopy,
                  label1: event.target.value,
                });
              }}
              value={
                dataRelationCopy.label1 === ""
                  ? undefined
                  : dataRelationCopy.label1
              }
            />
            <Dropdown
              placeholder="Select Direction1"
              selection
              options={getDirections()}
              onChange={(event, data) => {
                setDataRelationCopy({
                  ...dataRelationCopy,
                  direction1: Direction[data.value as Direction],
                });
              }}
              value={dataRelationCopy.direction1}
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
                setDataRelationCopy({
                  ...dataRelationCopy,
                  data2Fk: Number(data.value),
                });
              }}
              value={
                dataRelationCopy.data2Fk === -1
                  ? undefined
                  : dataRelationCopy.data2Fk
              }
            />
            <Dropdown
              placeholder="Select Type2"
              selection
              options={getTypes()}
              onChange={(event, data) => {
                setDataRelationCopy({
                  ...dataRelationCopy,
                  type2: RelationType[data.value as RelationType],
                });
              }}
              value={dataRelationCopy.type2}
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
              onChange={(event: any) => {
                setDataRelationCopy({
                  ...dataRelationCopy,
                  label2: event.target.value,
                });
              }}
              value={
                dataRelationCopy.label2 === ""
                  ? undefined
                  : dataRelationCopy.label2
              }
            />
            <Dropdown
              placeholder="Select Direction2"
              selection
              options={getDirections()}
              onChange={(event, data) => {
                setDataRelationCopy({
                  ...dataRelationCopy,
                  direction2: Direction[data.value as Direction],
                });
              }}
              value={dataRelationCopy.direction2}
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
        <Carv2DeleteButton onClick={deleteRelation} />
      </div>
    </ControllPanelEditSub>
  );
};
