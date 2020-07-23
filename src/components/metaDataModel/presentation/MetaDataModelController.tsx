import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ComponentCTO } from "../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceStepCTO } from "../../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../../dataAccess/access/to/ActionTO";
import { ConditionTO } from "../../../dataAccess/access/to/ConditionTO";
import { DataRelationTO } from "../../../dataAccess/access/to/DataRelationTO";
import { DATA_INSTANCE_ID_FACTOR, getDataAndInstanceIds } from "../../../dataAccess/access/to/DataTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { ActionType } from "../../../dataAccess/access/types/ActionType";
import { EditActions, editSelectors } from "../../../slices/EditSlice";
import { MasterDataActions, masterDataSelectors } from "../../../slices/MasterDataSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { ComponentData } from "../../../viewDataTypes/ComponentData";
import { ViewFragmentProps } from "../../../viewDataTypes/ViewFragment";
import { ViewFragmentState } from "../../../viewDataTypes/ViewFragmentState";
import { MetaDataDnDBox } from "./fragments/MetaDataDnDBox";

interface MetaDataModelControllerProps {
  fullScreen?: boolean;
}

export const MetaDataModelController: FunctionComponent<MetaDataModelControllerProps> = (props) => {
  const { fullScreen } = props;

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
        fullScreen={fullScreen}
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
  // ----- EDIT -----
  const dataRelationToEdit: DataRelationTO | null = useSelector(editSelectors.relationToEdit);
  const stepToEdit: SequenceStepCTO | null = useSelector(editSelectors.stepToEdit);
  const actionToEdit: ActionTO | null = useSelector(editSelectors.actionToEdit);
  const conditionToEdit: ConditionTO | null = useSelector(editSelectors.conditionToEdit);
  const dataSetupToEdit: DataSetupCTO | null = useSelector(editSelectors.dataSetupToEdit);
  // ----- VIEW -----
  const currentComponentDatas: ComponentData[] = useSelector(sequenceModelSelectors.selectComponentData);
  const errors: ActionTO[] = useSelector(sequenceModelSelectors.selectErrors);
  const actions: ActionTO[] = useSelector(sequenceModelSelectors.selectActions);

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

  const getCompDatas = () => {
    let compDatas: ViewFragmentProps[] = [];
    compDatas.push(...getComponentDatasFromView());
    compDatas.push(...getComponentDatasFromEdit());
    return compDatas;
  };

  const getComponentDatasFromView = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    const compDatasFromErros: ViewFragmentProps[] = errors.map(mapActionToComponentDatas);
    const compDatasFromActions: ViewFragmentProps[] = actions.map(mapActionToComponentDatas);
    const compDatasFromCompDatas: ViewFragmentProps[] = currentComponentDatas.map(mapComponentDataToCompoenntData);
    compDatas.push(...compDatasFromErros);
    compDatas.push(
      ...compDatasFromActions.filter(
        (compDataFromAction) => !compDatas.some((cp) => compDataExists(cp, compDataFromAction))
      )
    );
    compDatas.push(
      ...compDatasFromCompDatas.filter(
        (compDataFromCompData) => !compDatas.some((cp) => compDataExists(cp, compDataFromCompData))
      )
    );
    return compDatas;
  };

  const getComponentDatasFromEdit = (): ViewFragmentProps[] => {
    let compDatas: ViewFragmentProps[] = [];
    const compDatasFromStepToEdit: ViewFragmentProps[] = stepToEdit?.actions.map(mapActionToComponentDatas) || [];
    const compDataFromActionToEdit: ViewFragmentProps | undefined = actionToEdit
      ? mapActionToComponentDatas(actionToEdit)
      : undefined;
    const compDataFromCondittionToEdit: ViewFragmentProps[] = mapConditionToCompData(conditionToEdit);
    const compDatasFromDataSetup: ViewFragmentProps[] = dataSetupToEdit
      ? dataSetupToEdit.initDatas.map(mapInitDataToCompData)
      : [];
    compDatas.push(...compDatasFromStepToEdit);
    compDatas.push(...compDataFromCondittionToEdit);
    compDatas.push(...compDatasFromDataSetup);
    if (compDataFromActionToEdit) {
      compDatas.push(compDataFromActionToEdit);
    }
    return compDatas;
  };

  function mapActionToComponentDatas(actionItem: ActionTO): ViewFragmentProps {
    const state: ViewFragmentState = mapActionTypeToViewFragmentState(actionItem.actionType);
    const parentId = getDataAndInstanceIds(actionItem.dataFk);
    return { name: getComponentNameById(actionItem.componentFk), state: state, parentId: parentId };
  }

  const mapComponentDataToCompoenntData = (compData: ComponentData): ViewFragmentProps => {
    return {
      name: getComponentNameById(compData.componentFk),
      parentId: compData.dataFk > DATA_INSTANCE_ID_FACTOR ? getDataAndInstanceIds(compData.dataFk) : compData.dataFk,
      state: ViewFragmentState.PERSISTENT,
    };
  };

  const mapConditionToCompData = (condition: ConditionTO | null): ViewFragmentProps[] => {
    let props: ViewFragmentProps[] = [];
    if (condition) {
      props = condition.dataFks.map((data) => {
        return {
          parentId: data > DATA_INSTANCE_ID_FACTOR ? getDataAndInstanceIds(data) : data,
          name: getComponentNameById(condition.componentFk),
          state: condition.has ? ViewFragmentState.CHECKED : ViewFragmentState.DELETED,
        };
      });
    }
    return props;
  };

  const mapInitDataToCompData = (initData: InitDataTO): ViewFragmentProps => {
    return {
      parentId: initData.dataFk,
      name: getComponentNameById(initData.componentFk),
      state: ViewFragmentState.NEW,
    };
  };

  const compDataExists = (propOne: ViewFragmentProps, propTwo: ViewFragmentProps) => {
    return propOne.parentId === propTwo.parentId && propOne.name === propTwo.name;
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
      // case ActionType.CHECK:
      //   cdState = ViewFragmentState.CHECKED;
      //   break;
    }
    return cdState;
  };

  return {
    datas,
    dataRelations,
    dataRelationToEdit,
    dataCTOToEdit,
    saveData,
    getComponentDatas: getCompDatas,
    handleDataClick: (dataId: number) => dispatch(SequenceModelActions.handleDataClickEvent(dataId)),
  };
};
