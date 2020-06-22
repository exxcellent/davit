import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentDataCTO } from "../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import {
  DataActions,
  selectCurrentData,
  selectCurrentRelation,
  selectDatas,
  selectRelations,
} from "../../../slices/DataSlice";
import { currentComponentDatas } from "../../../slices/SequenceSlice";
import { MetaDataDnDBox } from "./fragments/MetaDataDnDBox";

interface MetaDataModelControllerProps {}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (props) => {
  const {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    componentDatas,
    saveData,
  } = useMetaDataModelViewModel();

  const createMetaDataDnDBox = () => {
    return (
      <MetaDataDnDBox
        dataCTOs={datas}
        onSaveCallBack={saveData}
        dataRelations={dataRelations}
        dataCTOToEdit={dataCTOToEdit}
        dataRelationToEdit={dataRelationToEdit}
        componentDatas={componentDatas}
      />
    );
  };

  return createMetaDataDnDBox();
};

const useMetaDataModelViewModel = () => {
  const datas: DataCTO[] = useSelector(selectDatas);
  const dataCTOToEdit: DataCTO | null = useSelector(selectCurrentData);
  const dataRelationToEdit: DataRelationCTO | null = useSelector(selectCurrentRelation);
  const dataRelations: DataRelationCTO[] = useSelector(selectRelations);
  const componentDatas: ComponentDataCTO[] = useSelector(currentComponentDatas);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(DataActions.loadDatasFromBackend());
    dispatch(DataActions.loadRelationsFromBackend());
  }, [dispatch]);

  const saveData = (dataCTO: DataCTO) => {
    dispatch(DataActions.saveData(dataCTO));
    dispatch(DataActions.loadRelationsFromBackend());
    if (dataCTO.data.id === dataRelationToEdit?.dataCTO1.data.id) {
      dispatch(
        DataActions.setRelationToEdit({
          ...dataRelationToEdit,
          dataCTO1: dataCTO,
        })
      );
    }
    if (dataCTO.data.id === dataRelationToEdit?.dataCTO2.data.id) {
      dispatch(
        DataActions.setRelationToEdit({
          ...dataRelationToEdit,
          dataCTO2: dataCTO,
        })
      );
    }
  };

  return {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    saveData,
    componentDatas,
  };
};
