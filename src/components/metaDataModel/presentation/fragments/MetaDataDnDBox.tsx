import { motion } from "framer-motion";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useCurrentHeight, useCurrentWitdh } from "../../../../app/Carv2";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { GeometricalDataCTO } from "../../../../dataAccess/access/cto/GeometraicalDataCTO";
import { DataRelationTO } from "../../../../dataAccess/access/to/DataRelationTO";
import { Carv2Util } from "../../../../utils/Carv2Util";
import { ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";
import { createDnDItem } from "../../../common/fragments/DnDWrapper";
import { createCornerConnection } from "../../../common/fragments/svg/Carv2Path";
import { createMetaDataFragment } from "./MetaDataFragment";

interface MetaDataDnDBox {
  dataCTOs: DataCTO[];
  dataCTOToEdit: DataCTO | null;
  dataRelationToEdit: DataRelationTO | null;
  dataRelations: DataRelationTO[];
  componentDatas: ViewFragmentProps[];
  onSaveCallBack: (dataCTO: DataCTO) => void;
  onClick: (dataId: number) => void;
  fullScreen?: boolean;
}

export const MetaDataDnDBox: FunctionComponent<MetaDataDnDBox> = (props) => {
  const {
    dataCTOs,
    dataCTOToEdit,
    onSaveCallBack,
    dataRelations,
    dataRelationToEdit,
    componentDatas,
    onClick,
    fullScreen,
  } = props;

  const constraintsRef = useRef(null);

  const [key, setKey] = useState<number>(0);

  const handleResize = () => {
    setKey(key + 1);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  // full size window
  const w1: number = useCurrentWitdh();
  const h1: number = useCurrentHeight();
  const h2: number = (w1 / 100) * 56.25;
  const w2: number = (h1 / 56.25) * 100;

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const dataCTO = dataCTOs.find((dataCTO) => dataCTO.geometricalData.position.id === positionId);
    if (dataCTO) {
      let copyDataCTO: DataCTO = Carv2Util.deepCopy(dataCTO);
      copyDataCTO.geometricalData.position.x = x;
      copyDataCTO.geometricalData.position.y = y;
      onSaveCallBack(copyDataCTO);
    }
  };

  const createConnections = () => {
    return dataRelations.map((dataRelation) => {
      const geoData1: GeometricalDataCTO | null = getGeometriaclDataByDataId(dataRelation.data1Fk);
      const geoData2: GeometricalDataCTO | null = getGeometriaclDataByDataId(dataRelation.data2Fk);
      if (!(dataRelationToEdit && dataRelationToEdit.id === dataRelation.id) && geoData1 && geoData2) {
        return createCornerConnection(geoData1, geoData2, dataRelation, dataRelation.id, constraintsRef);
      } else {
        return <></>;
      }
    });
  };

  const createDnDMetaDataFragmentIfNotinEdit = (dataCTO: DataCTO) => {
    if (!(dataCTOToEdit && dataCTOToEdit.data.id === dataCTO.data.id)) {
      return createDnDMetaDataFragment(dataCTO);
    }
  };

  const createDnDMetaDataFragment = (dataCTO: DataCTO) => {
    let metaDataFragment = createMetaDataFragment(
      dataCTO,
      componentDatas.filter(
        (comp) =>
          comp.parentId === dataCTO.data.id ||
          (comp.parentId as { dataId: number; instanceId: number }).dataId === dataCTO.data.id
      ),
      onClick
    );
    return createDnDItem(dataCTO.geometricalData, onPositionUpdate, constraintsRef, metaDataFragment);
  };

  const createDataRelationToEdit = (dataRelation: DataRelationTO) => {
    const geoData1: GeometricalDataCTO | null = getGeometriaclDataByDataId(dataRelation.data1Fk);
    const geoData2: GeometricalDataCTO | null = getGeometriaclDataByDataId(dataRelation.data2Fk);
    if (
      dataRelation.data1Fk !== -1 &&
      dataRelation.data2Fk !== -1 &&
      dataRelation.direction1 &&
      dataRelation.direction2 &&
      geoData1 &&
      geoData2
    ) {
      return createCornerConnection(geoData1, geoData2, dataRelation, dataRelation.id, constraintsRef, true);
    }
  };

  const getGeometriaclDataByDataId = (dataId: number): GeometricalDataCTO | null => {
    const data: DataCTO | undefined = dataCTOs.find((data) => data.data.id === dataId);
    if (data) {
      return data.geometricalData;
    }
    return null;
  };

  return (
    <motion.div
      id="datadndBox"
      ref={constraintsRef}
      style={
        fullScreen
          ? {
              height: h2,
              maxWidth: w2,
              borderWidth: "1px",
              borderStyle: "solid",
              backgroundColor: "var(--carv2-background-color)",
            }
          : {}
      }
      className={fullScreen ? "" : "dataModel"}
      key={key}
    >
      {dataCTOs.map(createDnDMetaDataFragmentIfNotinEdit)}
      {dataCTOToEdit && createDnDMetaDataFragment(dataCTOToEdit)}
      <motion.svg className="dataSVGArea">
        {createConnections()}
        {dataRelationToEdit && createDataRelationToEdit(dataRelationToEdit)}
      </motion.svg>
    </motion.div>
  );
};
