import React, { FunctionComponent } from "react";
import { ButtonGroup } from "semantic-ui-react";
import { ModuleRoutes } from "../../../../../../app/Davit";
import { DavitButtonIcon } from "../../../../../common/fragments/buttons/DavitButton";

export interface ControllPanelViewOptionsProps {}

export const ControllPanelViewOptions: FunctionComponent<ControllPanelViewOptionsProps> = (props) => {
    const { showActorPage, showDataPage, showTablePage, showFlowChartPage } = useFileOptionModelView();

    return (
        <div>
            <div className="optionField">
                <ButtonGroup>
                    <DavitButtonIcon icon="share" onClick={showActorPage} />
                    <DavitButtonIcon icon="sitemap" onClick={showDataPage} />
                    <DavitButtonIcon icon="table" onClick={showTablePage} />
                    <DavitButtonIcon icon="code branch" onClick={showFlowChartPage} />
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
