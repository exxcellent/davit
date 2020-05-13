import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { DataConnectionTO } from "../../../dataAccess/access/to/DataConnectionTO";
import { selectStep } from "../../common/viewModel/GlobalSlice";
import { MetaDataActions } from "../viewModel/MetaDataActions";
import {
  selectDataConnections,
  selectDatas,
} from "../viewModel/MetaDataModelSlice";
import { MetaDataDnDBox } from "./fragments/MetaDataDnDBox";

interface MetaDataModelControllerProps {}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (
  props
) => {
  const datas: DataCTO[] = useSelector(selectDatas);
  const dataConnections: DataConnectionTO[] = useSelector(
    selectDataConnections
  );
  const selectedStep: SequenceStepCTO | undefined = useSelector(selectStep);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(MetaDataActions.findAllDatas());
    dispatch(MetaDataActions.findAllConnections());
  }, [dispatch]);

  const saveData = (dataCTO: DataCTO) => {
    dispatch(MetaDataActions.saveData(dataCTO));
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
        connections={dataConnections}
      />
    );
  };

  return createMetaDataDnDBox();
};
