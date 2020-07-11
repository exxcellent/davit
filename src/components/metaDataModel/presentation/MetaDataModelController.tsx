import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../dataAccess/access/to/ActionTO";
import { ConditionTO } from "../../../dataAccess/access/to/ConditionTO";
import { DataRelationTO } from "../../../dataAccess/access/to/DataRelationTO";
import { ActionType } from "../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors, Mode } from "../../../slices/EditSlice";
import { MasterDataActions, masterDataSelectors } from "../../../slices/MasterDataSlice";
import { SequenceModelActions } from "../../../slices/SequenceModelSlice";
import { ViewFragmentProps } from "../../../viewDataTypes/ViewFragment";
import { ViewFragmentState } from "../../../viewDataTypes/ViewFragmentState";
import { MetaDataDnDBox } from "./fragments/MetaDataDnDBox";

interface MetaDataModelControllerProps { }

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (props) => {
  const {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    getComponentDatas,
    saveData,
    handleDataClick,
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
        onClick={handleDataClick}
      />
    );
  };

  return createMetaDataDnDBox();
};

const useMetaDataModelViewModel = () => {
  const dispatch = useDispatch();
  // ====== SELECTORS =====
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const dataCTOToEdit: DataCTO | null = useSelector(editSelectors.dataToEdit);
  const dataRelations: DataRelationTO[] = useSelector(masterDataSelectors.relations);
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const mode: Mode = useSelector(editSelectors.mode);
  // ----- EDIT -----
  const dataRelationToEdit: DataRelationTO | null = useSelector(editSelectors.relationToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const conditionToEdit: ConditionTO | null = useSelector(editSelectors.conditionToEdit);
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);

  React.useEffect(() => {
    dispatch(MasterDataActions.loadDatasFromBackend());
    dispatch(MasterDataActions.loadRelationsFromBackend());
  }, [dispatch]);

  const saveData = (dataCTO: DataCTO) => {
    dispatch(EditActions.data.save(dataCTO));
    dispatch(MasterDataActions.loadRelationsFromBackend());
    if (dataCTO.data.id === dataRelationToEdit?.data1Fk) {
      dispatch(EditActions.setMode.editRelation(dataRelationToEdit));
    }
    if (dataCTO.data.id === dataRelationToEdit?.data2Fk) {
      dispatch(EditActions.setMode.editRelation(dataRelationToEdit));
    }
  };

  const getComponentNameById = (id: number): string => {
    return components.find((comp) => comp.component.id === id)?.component.name || "Could not find Component";
  };

  const mapActionTypeToViewFragmentState = (actionType: ActionType): ViewFragmentState => {
    let cdState: ViewFragmentState;
    switch (actionType) {
      case ActionType.ADD:
        cdState = ViewFragmentState.NEW;
        break;
      case ActionType.DELETE:
        cdState = ViewFragmentState.DELETED;
        break;
      case ActionType.CHECK:
        cdState = ViewFragmentState.CHECKED;
        break;
    }
    return cdState;
  };

  const getComponentDatas = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    switch (mode) {
      case Mode.EDIT_SEQUENCE_STEP:
        stepToEdit?.actions.forEach((action) =>
          compDatas.push({
            partenId: action.dataFk,
            name: getComponentNameById(action.componentFk),
            state: mapActionTypeToViewFragmentState(action.actionType),
          })
        );
        break;
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        if (!isNullOrUndefined(actionToEdit)) {
          compDatas.push({
            partenId: actionToEdit.dataFk,
            name: getComponentNameById(actionToEdit.componentFk),
            state: mapActionTypeToViewFragmentState(actionToEdit.actionType),
          });
        }
        break;
      case Mode.EDIT_SEQUENCE_CONDITION:
        if (!isNullOrUndefined(conditionToEdit)) {
          conditionToEdit.dataFks.forEach((data) =>
            compDatas.push({
              partenId: data,
              name: getComponentNameById(conditionToEdit.componentFk),
              state: conditionToEdit.has ? ViewFragmentState.CHECKED : ViewFragmentState.DELETED,
            })
          );
        }
        break;
      case Mode.EDIT_DATA_SETUP:
        if (!isNullOrUndefined(dataSetupToEdit)) {
          dataSetupToEdit.initDatas.forEach((initData) =>
            compDatas.push({
              partenId: initData.dataFk,
              name: getComponentNameById(initData.componentFk),
              state: ViewFragmentState.NEW,
            })
          );
        }
        break;
    }
    return compDatas;
  };

  return {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    saveData,
    getComponentDatas,
    handleDataClick: (dataId: number) => dispatch(SequenceModelActions.handleDataClickEvent(dataId)),
  };
};
