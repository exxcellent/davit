import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, Input } from "semantic-ui-react";
import { DataCTO } from "../../../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../../../dataAccess/access/cto/DataRelationCTO";
import {
  Direction,
  RelationType,
} from "../../../../../dataAccess/access/to/DataRelationTO";
import { Carv2Util } from "../../../../../utils/Carv2Util";
import { Carv2DeleteButton } from "../../../../common/fragments/buttons/Carv2DeleteButton";
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
  const [label, setLabel] = useState<string>("Create Data Relation");
  // const [dataRelationCopy, setDataRelationCopy] = useState<DataRelationTO>(
  //   new DataRelationTO()
  // );
  const dispatch = useDispatch();

  useEffect(() => {
    // setDataRelationCopy({ ...dataRelation.dataRelationTO });
    if (dataRelation.dataRelationTO.id !== -1) {
      setLabel("Edit Data Relation");
    }
  }, [dataRelation]);

  const setRelationToEdit = (dataRelation: DataRelationCTO | null) => {
    console.info("setRelationToEdit: ", dataRelation);
    dispatch(ControllPanelActions.setDataRelationToEdit(dataRelation));
  };

  const cancelEditRelation = () => {
    dispatch(ControllPanelActions.cancelEditDataRelation());
  };

  const saveRelation = () => {
    // TODO Felder validieren.
    console.log("saving relation.");
    let copyRelation: DataRelationCTO = Carv2Util.deepCopy(dataRelation);
    copyRelation.dataCTO1 = datas.find(
      (data) => data.data.id === dataRelation.dataRelationTO.data1Fk
    )!;
    copyRelation.dataCTO2 = datas.find(
      (data) => data.data.id === dataRelation.dataRelationTO.data2Fk
    )!;
    dispatch(
      ControllPanelActions.saveDataConnection(Carv2Util.deepCopy(copyRelation))
    );
    if (!isCreateAnother) {
      cancelEditRelation();
    } else {
      setRelationToEdit(new DataRelationCTO());
    }
  };

  const deleteRelation = () => {
    dispatch(ControllPanelActions.deleteRelation(dataRelation));
    cancelEditRelation();
  };

  const dataToOption = (data: DataCTO): DropdownItemProps => {
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
    <ControllPanelEditSub label={label}>
      <div style={{ display: "flex", justifyContent: "center" }}>
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
                setRelationToEdit({
                  ...dataRelation,
                  dataRelationTO: {
                    ...dataRelation.dataRelationTO,
                    data1Fk: Number(data.value),
                  },
                  dataCTO1: datas.find(
                    (item) => item.data.id === Number(data.value)
                  )!,
                });
              }}
              value={
                dataRelation.dataRelationTO.data1Fk === -1
                  ? undefined
                  : dataRelation.dataRelationTO.data1Fk
              }
            />
            <Dropdown
              placeholder="Select Type1"
              selection
              options={getTypes()}
              onChange={(event: any) =>
                setRelationToEdit({
                  ...dataRelation,
                  dataRelationTO: {
                    ...dataRelation.dataRelationTO,
                    type1: event.target.value,
                  },
                })
              }
              // setDataRelationCopy({
              //   ...dataRelationCopy,
              //   type1: RelationType[data.value as RelationType],
              // });
              value={dataRelation.dataRelationTO.type1}
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
              onChange={(event: any) =>
                setRelationToEdit({
                  ...dataRelation,
                  dataRelationTO: {
                    ...dataRelation.dataRelationTO,
                    label1: event.target.value,
                  },
                })
              }
              value={
                dataRelation.dataRelationTO.label1 === ""
                  ? undefined
                  : dataRelation.dataRelationTO.label1
              }
            />
            <Dropdown
              placeholder="Select Direction1"
              selection
              options={getDirections()}
              onChange={(event, data) =>
                setRelationToEdit({
                  ...dataRelation,
                  dataRelationTO: {
                    ...dataRelation.dataRelationTO,
                    direction1: Direction[data.value as Direction],
                  },
                })
              }
              value={dataRelation.dataRelationTO.direction1}
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
                setRelationToEdit({
                  ...dataRelation,
                  dataRelationTO: {
                    ...dataRelation.dataRelationTO,
                    data2Fk: Number(data.value),
                  },
                  dataCTO2: datas.find(
                    (item) => item.data.id === Number(data.value)
                  )!,
                });
              }}
              value={
                dataRelation.dataRelationTO.data2Fk === -1
                  ? undefined
                  : dataRelation.dataRelationTO.data2Fk
              }
            />
            <Dropdown
              placeholder="Select Type2"
              selection
              options={getTypes()}
              onChange={(event: any) =>
                setRelationToEdit({
                  ...dataRelation,
                  dataRelationTO: {
                    ...dataRelation.dataRelationTO,
                    type2: event.target.value,
                  },
                })
              }
              value={dataRelation.dataRelationTO.type2}
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
              onChange={(event: any) =>
                setRelationToEdit({
                  ...dataRelation,
                  dataRelationTO: {
                    ...dataRelation.dataRelationTO,
                    label2: event.target.value,
                  },
                })
              }
              value={
                dataRelation.dataRelationTO.label2 === ""
                  ? undefined
                  : dataRelation.dataRelationTO.label2
              }
            />
            <Dropdown
              placeholder="Select Direction2"
              selection
              options={getDirections()}
              onChange={(event, data) =>
                setRelationToEdit({
                  ...dataRelation,
                  dataRelationTO: {
                    ...dataRelation.dataRelationTO,
                    direction2: Direction[data.value as Direction],
                  },
                })
              }
              value={dataRelation.dataRelationTO.direction2}
            />
          </div>
        </div>
      </div>
      <div className="columnDivider" style={{ display: "flex" }}>
        <Carv2SubmitCancel
          onSubmit={saveRelation}
          onChange={() => setIsCreateAnother(!isCreateAnother)}
          onCancel={cancelEditRelation}
        />
      </div>
      {dataRelation.dataRelationTO.id !== -1 && (
        <div className="columnDivider">
          <div
            className="controllPanelEditChild"
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <Carv2DeleteButton onClick={deleteRelation} />
          </div>
        </div>
      )}
    </ControllPanelEditSub>
  );
};
