import React, { FunctionComponent } from "react";
import { ButtonGroup } from "semantic-ui-react";
import { ModuleRoutes } from "../../../../../../app/Carv2";
import { Carv2ButtonIcon } from "../../../../../common/fragments/buttons/Carv2Button";

export interface ControllPanelViewOptionsProps { }

export const ControllPanelViewOptions: FunctionComponent<ControllPanelViewOptionsProps> = (props) => {
  const { showComponentPage, showDataPage, showTablePage } = useFileOptionModelView();

  return (
    <div>
      <div className="optionField">
        <ButtonGroup>
          <Carv2ButtonIcon icon="share" onClick={showComponentPage} />
          <Carv2ButtonIcon icon="sitemap" onClick={showDataPage} />
          <Carv2ButtonIcon icon="table" onClick={showTablePage} />
        </ButtonGroup>
      </div>
      <div style={{ textAlign: "center", color: "white" }}>{"file".toUpperCase()}</div>
    </div>
  );
};

const useFileOptionModelView = () => {
  const showComponentPage = () => {
    window.open(ModuleRoutes.component, "_blank", "toolbar=no,top=0,left=0")
  }
  const showDataPage = () => {
    window.open(ModuleRoutes.data, "_blank", "toolbar=no,top=0,left=0")
  }
  const showTablePage = () => {
    window.open(ModuleRoutes.table, "_blank", "toolbar=no,top=0,left=0")
  }

  return { showComponentPage, showDataPage, showTablePage };
};
