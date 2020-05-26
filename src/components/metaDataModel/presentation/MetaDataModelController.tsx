import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { selectStep } from "../../common/viewModel/GlobalSlice";
import { ControllPanelActions } from "../../controllPanel/viewModel/ControllPanelActions";
import {
  selectDataRelationToEdit,
  selectDataToEdit,
} from "../../controllPanel/viewModel/ControllPanelSlice";
import { MetaDataActions } from "../viewModel/MetaDataActions";
import {
  selectDataRelations,
  selectDatas,
} from "../viewModel/MetaDataModelSlice";
import { MetaDataDnDBox } from "./fragments/MetaDataDnDBox";

interface MetaDataModelControllerProps {}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (
  props
) => {
  const datas: DataCTO[] = useSelector(selectDatas);
  const dataCTOToEdit: DataCTO | null = useSelector(selectDataToEdit);
  const dataRelationToEdit: DataRelationCTO | null = useSelector(
    selectDataRelationToEdit
  );
  const dataRelations: DataRelationCTO[] = useSelector(selectDataRelations);
  const selectedStep: SequenceStepCTO | undefined = useSelector(selectStep);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(MetaDataActions.findAllDatas());
    dispatch(MetaDataActions.findAllRelations());
  }, [dispatch]);

  const saveData = (dataCTO: DataCTO) => {
    dispatch(MetaDataActions.saveData(dataCTO));
    dispatch(MetaDataActions.findAllRelations());
    if (dataCTO.data.id === dataRelationToEdit?.dataCTO1.data.id) {
      dispatch(
        ControllPanelActions.setDataRelationToEdit({
          ...dataRelationToEdit,
          dataCTO1: dataCTO,
        })
      );
    }
    if (dataCTO.data.id === dataRelationToEdit?.dataCTO2.data.id) {
      dispatch(
        ControllPanelActions.setDataRelationToEdit({
          ...dataRelationToEdit,
          dataCTO2: dataCTO,
        })
      );
    }
  };

  const deleteDat = (id: number) => {
    const dataToDelete: DataCTO | undefined = datas.find(
      (data) => data.data.id === id
    );
    if (dataToDelete) {
      dispatch(MetaDataActions.deleteData(dataToDelete));
    }
  };

  const createMetaDataDnDBox = () => {
    return (
      <MetaDataDnDBox
        dataCTOs={datas}
        onSaveCallBack={saveData}
        onDeleteCallBack={deleteDat}
        step={selectedStep}
        dataRelations={dataRelations}
        dataCTOToEdit={dataCTOToEdit}
        dataRelationToEdit={dataRelationToEdit}
      />
    );
  };

  return createMetaDataDnDBox();
};
