import React from "react";
import { ControllPanelController } from "../components/controllPanel/ControllPanelController";
import { MetaComponentModelController } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import "./Carv2.css";

export function Carv2() {
  return (
    <div className="Carv2">
      <React.StrictMode>
        <div className="carvGridContainer">
          <div className="controllerHeader">
            <ControllPanelController />
          </div>
          <div className="componentModel">
            <MetaComponentModelController />
          </div>
          <div className="dataModel"></div>
          <div className="leftMenu"></div>
          <div className="sequencModel"></div>
          <div className="sequenceTable"></div>
        </div>
      </React.StrictMode>
    </div>
  );
}
