import React from "react";
import { ErrorNotification } from "../components/common/fragments/ErrorNotification";
import { ControllPanelController } from "../components/controllPanel/presentation/ControllPanelController";
import { MetaComponentModelController } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { MetaDataModelController } from "../components/metaDataModel/presentation/MetaDataModelController";
import { SequenceModelController } from "../components/sequenceModel/SequenceModelController";
import { SequenceTableModelController } from "../components/sequenceTableModel/presentation/SequenceTableModelController";
import { SidePanelController } from "../components/sidePanel/SidePanelController";
import "./Carv2.css";

export function Carv2() {
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
