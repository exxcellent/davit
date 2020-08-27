import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ErrorNotification } from "../components/common/fragments/ErrorNotification";
import { ControllPanelController } from "../components/controllPanel/presentation/ControllPanelController";
import { MetaComponentModelController } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { MetaDataModelController } from "../components/metaDataModel/presentation/MetaDataModelController";
import { FlowChartController } from "../components/sequenceModel/FlowChartController";
import { SequenceTableModelController } from "../components/sequenceTableModel/presentation/SequenceTableModelController";
import { SidePanelController } from "../components/sidePanel/SidePanelController";
import { MasterDataActions } from "../slices/MasterDataSlice";
import { useZoomDisable } from "../utils/WindowUtil";
import "./Carv2.css";

export const ModuleRoutes = {
  home: "/",
  component: "/component",
  data: "/data",
  table: "/table",
  flowChart: "/flowChart",
};

// inital data load from backend.
export function Carv2() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(MasterDataActions.loadDataSetupsFromBackend());
    dispatch(MasterDataActions.loadComponentsFromBackend());
    dispatch(MasterDataActions.loadGroupsFromBackend());
    dispatch(MasterDataActions.loadDatasFromBackend());
    dispatch(MasterDataActions.loadRelationsFromBackend());
    dispatch(MasterDataActions.loadSequencesFromBackend());
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(MasterDataActions.loadChainLinksFromBackend());
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
  }, [dispatch]);

  // disable global key shortcuts.
  useZoomDisable();

  return (
    <div className="Carv2">
      <Switch>
        <Route exact path={ModuleRoutes.home}>
          <div className="carvGridContainer">
            <ControllPanelController />
            <MetaComponentModelController />
            <MetaDataModelController />
            <SidePanelController />
            <FlowChartController />
            <SequenceTableModelController />
            <ErrorNotification />
          </div>
        </Route>
        <Route exact path={ModuleRoutes.component}>
          <div className="Carv2">
            <div className="componentPage">
              <MetaComponentModelController fullScreen />
            </div>
          </div>
        </Route>
        <Route exact path={ModuleRoutes.data}>
          <div className="Carv2">
            <div className="componentPage">
              <MetaDataModelController fullScreen />
            </div>
          </div>
        </Route>
        <Route exact path={ModuleRoutes.table}>
          <div className="Carv2">
            <div className="componentPage">
              <SequenceTableModelController fullScreen />
            </div>
          </div>
        </Route>
        <Route exact path={ModuleRoutes.flowChart}>
          <div className="Carv2">
            <div className="componentPage">
              <FlowChartController fullScreen />
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}
