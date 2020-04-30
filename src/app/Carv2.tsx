import React from "react";
import { ControllPanelController } from "../components/controllPanel/presentation/ControllPanelController";
import { MetaComponentModelController } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { SidePanelController } from "../components/sidePanel/SidePanelController";
import "./Carv2.css";

export function Carv2() {
  return (
    <div className="Carv2">
      <div className="carvGridContainer">
        <div className="controllerHeader">
          <ControllPanelController />
        </div>
        <div className="componentModel">
          <MetaComponentModelController />
        </div>
        <div className="dataModel"></div>
        <div className="leftPanel">
          <SidePanelController />
        </div>
        <div className="sequencModel"></div>
        <div className="sequenceTable"></div>
      </div>
    </div>
  );
}
