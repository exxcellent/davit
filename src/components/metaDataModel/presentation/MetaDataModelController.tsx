import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationTO } from "../../../dataAccess/access/to/DataRelationTO";
import { DataActions } from "../../../slices/DataSlice";
import { editSelectors } from "../../../slices/EditSlice";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { MetaDataDnDBox } from "./fragments/MetaDataDnDBox";

interface MetaDataModelControllerProps {}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (props) => {
  const {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    getComponentDatas,
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
        componentDatas={getComponentDatas}
      />
    );
  };

  return createMetaDataDnDBox();
};

const useMetaDataModelViewModel = () => {
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const dataCTOToEdit: DataCTO | null = useSelector(editSelectors.dataToEdit);
  const dataRelationToEdit: DataRelationTO | null = useSelector(editSelectors.relationToEdit);
  const dataRelations: DataRelationTO[] = useSelector(masterDataSelectors.relations);

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(DataActions.loadDatasFromBackend());
    dispatch(DataActions.loadRelationsFromBackend());
  }, [dispatch]);

  const saveData = (dataCTO: DataCTO) => {
    dispatch(DataActions.saveData(dataCTO));
    dispatch(DataActions.loadRelationsFromBackend());
    if (dataCTO.data.id === dataRelationToEdit?.data1Fk) {
      dispatch(
        DataActions.setRelationToEdit({
          ...dataRelationToEdit,
        })
      );
    }
    if (dataCTO.data.id === dataRelationToEdit?.data2Fk) {
      dispatch(
        DataActions.setRelationToEdit({
          ...dataRelationToEdit,
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
    getComponentDatas: [],
  };
};
