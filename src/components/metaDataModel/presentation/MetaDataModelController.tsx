import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { currentStep } from "../../../slices/SequenceSlice";
import { ControllPanelActions } from "../../controllPanel/viewModel/ControllPanelActions";
import { MetaDataDnDBox } from "./fragments/MetaDataDnDBox";

interface MetaDataModelControllerProps {}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (props) => {
  const {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    selectedStep,
    saveData,
  } = useMetaDataModelViewModel();

  const createMetaDataDnDBox = () => {
    return (
      <MetaDataDnDBox
        dataCTOs={datas}
        onSaveCallBack={saveData}
        step={selectedStep}
        dataRelations={dataRelations}
        dataCTOToEdit={dataCTOToEdit}
        dataRelationToEdit={dataRelationToEdit}
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
  const selectedStep: SequenceStepCTO | null = useSelector(currentStep);
  const dispatch = useDispatch();

  // const [dimensions, setDimensions] = useState({ height: window.innerHeight, width: window.innerWidth });

  // const useHandleResize = () => {
  //   setDimensions({ height: window.innerHeight, width: window.innerWidth });
  //   window.addEventListener("resize", handleResize);

  //   return () => window.removeEventListener("resize", handleResize);
  // };

  React.useEffect(() => {
    dispatch(DataActions.loadDatasFromBackend());
    dispatch(DataActions.loadRelationsFromBackend());

    // handleResize();
  }, [dispatch]);

  const saveData = (dataCTO: DataCTO) => {
    dispatch(DataActions.saveData(dataCTO));
    dispatch(DataActions.loadRelationsFromBackend());
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

  return {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    selectedStep,
    saveData,
  };
};
