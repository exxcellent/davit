import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ActionCTO } from "../../../dataAccess/access/cto/ActionCTO";
import { ComponentDataCTO } from "../../../dataAccess/access/cto/ComponentDataCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataRelationCTO } from "../../../dataAccess/access/cto/DataRelationCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import {
  DataActions,
  selectCurrentData,
  selectCurrentRelation,
  selectDatas,
  selectRelations,
} from "../../../slices/DataSlice";
import { Mode, selectMode } from "../../../slices/GlobalSlice";
import { currentActionToEdit, currentComponentDatas, currentStep } from "../../../slices/SequenceSlice";
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
        componentDatas={getComponentDatas()}
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
  const selectedStep: SequenceStepCTO | null = useSelector(currentStep);
  const action: ActionCTO | null = useSelector(currentActionToEdit);
  const mode: Mode = useSelector(selectMode);
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

  const getComponentDatas = (): (ComponentDataCTO | ActionCTO)[] => {
    if (!isNullOrUndefined(selectedStep))
      if (mode === Mode.EDIT_SEQUENCE_STEP) {
        return selectedStep.actions;
      }
    if (mode === Mode.EDIT_SEQUENCE_STEP_ACTION && !isNullOrUndefined(action)) {
      return [action];
    }
    return componentDatas;
  };

  return {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    saveData,
    getComponentDatas,
  };
};
