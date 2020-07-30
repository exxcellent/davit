import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ErrorNotification } from "../components/common/fragments/ErrorNotification";
import { ControllPanelController } from "../components/controllPanel/presentation/ControllPanelController";
import { MetaComponentModelController } from "../components/metaComponentModel/presentation/MetaComponentModelController";
import { MetaDataModelController } from "../components/metaDataModel/presentation/MetaDataModelController";
import { SequenceModelController } from "../components/sequenceModel/SequenceModelController";
import { SequenceTableModelController } from "../components/sequenceTableModel/presentation/SequenceTableModelController";
import { SidePanelController } from "../components/sidePanel/SidePanelController";
import { MasterDataActions } from "../slices/MasterDataSlice";
import "./Carv2.css";

export const ModuleRoutes = {
  home: "/",
  component: "/component",
  data: "/data",
  table: "/table",
  flowChart: "/flowChart",
};

export function Carv2() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(MasterDataActions.loadDataSetupsFromBackend());
    dispatch(MasterDataActions.loadComponentsFromBackend());
    dispatch(MasterDataActions.loadGroupsFromBackend());
    dispatch(MasterDataActions.loadDatasFromBackend());
    dispatch(MasterDataActions.loadRelationsFromBackend());
    dispatch(MasterDataActions.loadSequencesFromBackend());
  }, [dispatch]);

  useKeyListener();

  return (
    <div className="Carv2">
      <Switch>
        <Route exact path={ModuleRoutes.home}>
          <div className="carvGridContainer">
            <ControllPanelController />
            <MetaComponentModelController />
            <MetaDataModelController />
            <SidePanelController />
            <SequenceModelController />
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
              <SequenceModelController fullScreen />
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const getHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

export const useCurrentWitdh = () => {
  // save current window width in the state object
  let [width, setWidth] = useState(getWidth());

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId: number | undefined = undefined;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return width;
};

export const useCurrentHeight = () => {
  // save current window width in the state object
  let [height, setHeight] = useState(getHeight());

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId: number | undefined = undefined;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setHeight(getHeight()), 150);
    };
    // set resize listener
    window.addEventListener("resize", resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return height;
};

const useKeyListener = () => {
  const handleKeyDown = (event: WheelEvent) => {
    if (event.ctrlKey === true) {
      console.warn("no scroll");
      event.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener("wheel", handleKeyDown);
  });
};
