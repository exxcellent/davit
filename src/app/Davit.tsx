import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ErrorNotification } from '../components/common/fragments/ErrorNotification';
import { ControllPanelController } from '../components/controllPanel/presentation/ControllPanelController';
import { ActorModelController } from '../components/metaActorModel/presentation/ActorModelController';
import { DataModelController } from '../components/metaDataModel/DataModelController';
import { FlowChartController } from '../components/sequenceModel/FlowChartController';
import { SequenceTableModelController } from '../components/sequenceTableModel/presentation/SequenceTableModelController';
import { SidePanelController } from '../components/sidePanel/SidePanelController';
import { MasterDataActions } from '../slices/MasterDataSlice';
import './css/Davit.css';

// electron needs HashRouter
// import { HashRouter as BrowserRouter } from 'react-router-dom';

export const ModuleRoutes = {
    home: '/',
    actor: '/component',
    data: '/data',
    table: '/table',
    flowChart: '/flowChart',
};

// inital data load from backend.
export function Davit() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(MasterDataActions.loadAll());
    }, [dispatch]);

    // disable global key shortcuts.
    // TODO: enable when Arrows working.
    // useCustomZoomEvent();

    return (
        <BrowserRouter>
            <Switch>
                <Route exact path={ModuleRoutes.home}>
                    <div className="carvGridContainer">
                        <ControllPanelController />
                        <ActorModelController />
                        <DataModelController />
                        <SidePanelController />
                        <FlowChartController />
                        <SequenceTableModelController />
                        <ErrorNotification />
                    </div>
                </Route>
                <Route exact path={ModuleRoutes.actor}>
                    <div className="Carv2">
                        <div className="componentPage">
                            <ActorModelController fullScreen />
                        </div>
                    </div>
                </Route>
                <Route exact path={ModuleRoutes.data}>
                    <div className="Carv2">
                        <div className="componentPage">
                            <DataModelController fullScreen />
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
        </BrowserRouter>
    );
}
