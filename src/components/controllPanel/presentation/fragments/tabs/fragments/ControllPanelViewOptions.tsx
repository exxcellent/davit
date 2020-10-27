import React, { FunctionComponent } from 'react';
import { ButtonGroup } from 'semantic-ui-react';

import { ModuleRoutes } from '../../../../../../app/Carv2';
import { Carv2ButtonIcon } from '../../../../../common/fragments/buttons/Carv2Button';

export interface ControllPanelViewOptionsProps {}

export const ControllPanelViewOptions: FunctionComponent<ControllPanelViewOptionsProps> = (props) => {
  const { showActorPage, showDataPage, showTablePage, showFlowChartPage } = useFileOptionModelView();

  return (
    <div>
      <div className="optionField">
        <ButtonGroup>
          <Carv2ButtonIcon icon="share" onClick={showActorPage} />
          <Carv2ButtonIcon icon="sitemap" onClick={showDataPage} />
          <Carv2ButtonIcon icon="table" onClick={showTablePage} />
          <Carv2ButtonIcon icon="code branch" onClick={showFlowChartPage} />
        </ButtonGroup>
      </div>
      <div style={{ textAlign: "center", color: "white" }}>{"Open in new window".toUpperCase()}</div>
    </div>
  );
};

const useFileOptionModelView = () => {
  const showActorPage = () => {
    window.open(ModuleRoutes.actor, "_blank", "toolbar=no,top=0,left=0");
  };
  const showDataPage = () => {
    window.open(ModuleRoutes.data, "_blank", "toolbar=no,top=0,left=0");
  };
  const showTablePage = () => {
    window.open(ModuleRoutes.table, "_blank", "toolbar=no,top=0,left=0");
  };
  const showFlowChartPage = () => {
    window.open(ModuleRoutes.flowChart, "_blank", "toolbar=no,top=0,left=0");
  };

  return { showActorPage, showDataPage, showTablePage, showFlowChartPage };
};
