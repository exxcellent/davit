import { motion } from 'framer-motion';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

import { ASPECT_RATIO, WINDOW_FACTOR } from '../../../app/Carv2Constants';
import { DataCTO } from '../../../dataAccess/access/cto/DataCTO';
import { GeometricalDataCTO } from '../../../dataAccess/access/cto/GeometraicalDataCTO';
import { DataRelationTO } from '../../../dataAccess/access/to/DataRelationTO';
import { Carv2Util } from '../../../utils/Carv2Util';
import { useCurrentHeight, useCurrentWitdh } from '../../../utils/WindowUtil';
import { ViewFragmentProps } from '../../../viewDataTypes/ViewFragment';
import { createDnDItem } from '../../common/fragments/DnDWrapper';
import { createCornerConnection } from '../../common/fragments/svg/Carv2Path';
import { Carv2Card } from '../../metaComponentModel/presentation/fragments/Carv2Card';

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
  const currentWindowWitdh: number = useCurrentWitdh();
  const currentWindowHeight: number = useCurrentHeight();
  const newHeight: number = (currentWindowWitdh / WINDOW_FACTOR) * ASPECT_RATIO;
  const newWidth: number = (currentWindowHeight / ASPECT_RATIO) * WINDOW_FACTOR;

  const onPositionUpdate = (x: number, y: number, positionId: number) => {
    const dataCTO = dataCTOs.find(
      (dataCTO) => dataCTO.geometricalData.position.id === positionId
    );
    if (dataCTO) {
      let copyDataCTO: DataCTO = Carv2Util.deepCopy(dataCTO);
      copyDataCTO.geometricalData.position.x = x;
      copyDataCTO.geometricalData.position.y = y;
      onSaveCallBack(copyDataCTO);
    }
  };

  const createConnections = () => {
    return dataRelations.map((dataRelation) => {
      const geoData1: GeometricalDataCTO | null = getGeometriaclDataByDataId(
        dataRelation.data1Fk
      );
      const geoData2: GeometricalDataCTO | null = getGeometriaclDataByDataId(
        dataRelation.data2Fk
      );
      if (
        !(dataRelationToEdit && dataRelationToEdit.id === dataRelation.id) &&
        geoData1 &&
        geoData2
      ) {
        return createCornerConnection(
          geoData1,
          geoData2,
          dataRelation,
          dataRelation.id,
          constraintsRef
        );
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
    let metaDataFragment: JSX.Element = (
      <Carv2Card
        id={dataCTO.data.id}
        initName={dataCTO.data.name}
        initWidth={dataCTO.geometricalData.geometricalData.width}
        initHeigth={dataCTO.geometricalData.geometricalData.height}
        dataFragments={componentDatas.filter(
          (comp) =>
            comp.parentId === dataCTO.data.id ||
            (comp.parentId as { dataId: number; instanceId: number }).dataId ===
              dataCTO.data.id
        )}
        instances={dataCTO.data.instances}
        zoomFactor={1}
        type="DATA"
      />
    );
    return createDnDItem(
      dataCTO.geometricalData.position,
      onPositionUpdate,
      constraintsRef,
      metaDataFragment
    );
  };

  const createDataRelationToEdit = (dataRelation: DataRelationTO) => {
    const geoData1: GeometricalDataCTO | null = getGeometriaclDataByDataId(
      dataRelation.data1Fk
    );
    const geoData2: GeometricalDataCTO | null = getGeometriaclDataByDataId(
      dataRelation.data2Fk
    );
    if (
      dataRelation.data1Fk !== -1 &&
      dataRelation.data2Fk !== -1 &&
      dataRelation.direction1 &&
      dataRelation.direction2 &&
      geoData1 &&
      geoData2
    ) {
      return createCornerConnection(
        geoData1,
        geoData2,
        dataRelation,
        dataRelation.id,
        constraintsRef,
        true
      );
    }
  };

  const getGeometriaclDataByDataId = (
    dataId: number
  ): GeometricalDataCTO | null => {
    const data: DataCTO | undefined = dataCTOs.find(
      (data) => data.data.id === dataId
    );
    if (data) {
      return data.geometricalData;
    }
    return null;
  };

  return (
    <motion.div
      id="datadndBox"
      ref={constraintsRef}
      style={fullScreen ? { height: newHeight, maxWidth: newWidth } : {}}
      className={fullScreen ? "dataModelFullscreen" : "dataModel"}
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
