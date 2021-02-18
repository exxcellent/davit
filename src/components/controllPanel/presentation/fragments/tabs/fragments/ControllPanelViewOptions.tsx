import { faShare } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";
import { ButtonGroup } from "semantic-ui-react";
import { ModuleRoutes } from "../../../../../../app/Davit";
import { DavitButton } from "../../../../../common/fragments/buttons/DavitButton";

export interface ControllPanelViewOptionsProps {}

export const ControllPanelViewOptions: FunctionComponent<ControllPanelViewOptionsProps> = (props) => {
    const { showActorPage, showDataPage, showTablePage, showFlowChartPage } = useFileOptionModelView();

    return (
        <div>
            <div className="optionField">
                <ButtonGroup>
                    <DavitButton iconName={faShare} onClick={showActorPage} />
                    <DavitButton iconName={faShare} onClick={showDataPage} />
                    <DavitButton iconName={faShare} onClick={showTablePage} />
                    <DavitButton iconName={faShare} onClick={showFlowChartPage} />
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
