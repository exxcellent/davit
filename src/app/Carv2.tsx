import React from "react";
import { useDispatch } from "react-redux";
import { ErrorNotification } from "../components/common/fragments/ErrorNotification";
import { ControllPanelController } from "../components/controllPanel/presentation/ControllPanelController";
import { MetaComponentModelController } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { MetaDataModelController } from "../components/metaDataModel/presentation/MetaDataModelController";
import { SequenceModelController } from "../components/sequenceModel/SequenceModelController";
import { SequenceTableModelController } from "../components/sequenceTableModel/presentation/SequenceTableModelController";
import { SidePanelController } from "../components/sidePanel/SidePanelController";
import { DataSetupActions } from "../slices/DataSetupSlice";
import { MasterDataActions } from "../slices/MasterDataSlice";
import { SequenceActions } from "../slices/SequenceSlice";
import "./Carv2.css";

export function Carv2() {
  const dispatch = useDispatch();
  dispatch(DataSetupActions.loadDataSetupsFromBackend());
  dispatch(MasterDataActions.loadComponentsFromBackend());
  dispatch(MasterDataActions.loadGroupsFromBackend());
  dispatch(MasterDataActions.loadDatasFromBackend());
  dispatch(MasterDataActions.loadRelationsFromBackend());
  dispatch(SequenceActions.loadSequencesFromBackend());

  return (
    <div className="Carv2">
      <div className="carvGridContainer">
        <ControllPanelController />
        <MetaComponentModelController />
        <MetaDataModelController />
        <SidePanelController />
        <SequenceModelController />
        <SequenceTableModelController />
        <ErrorNotification />
      </div>
    </div>
  );
}
