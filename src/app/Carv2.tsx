import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faEllipsisH, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { FormattedMessage } from "react-intl";
import { ControllPanelController } from "../components/controllPanel/ControllPanelController";
import { MetaComponentModelController } from "../components/MetaComponentModel/Presentation/MetaComponentModelController";

library.add(fab, faPlusSquare, faEllipsisH);

export function Carv2() {
  return (
    <div className="Carv2">
      <React.StrictMode>
        <ControllPanelController>
          <label>Sprache: </label>
          <FormattedMessage id="language"></FormattedMessage>
        </ControllPanelController>
        <MetaComponentModelController />
      </React.StrictMode>
    </div>
  );
}
