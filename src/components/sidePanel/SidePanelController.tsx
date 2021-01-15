import React, { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DAVIT_VERISON } from '../../app/DavitConstants';
import logo from '../../icons/logo200.png';
import { EditActions, editSelectors, Mode } from '../../slices/EditSlice';
import { DavitButtonGroup } from '../common/fragments/buttons/DavitButtonGroup';
import { DavitSidePanelButton } from '../common/fragments/buttons/DavitSidePanelButton';

export interface SidePanelProps {}

export const SidePanelController: FunctionComponent<SidePanelProps> = (props) => {
    const { setModeToEdit, setModeToFile, setModeToView, setModeToTab, mode } = useSidePanelViewModel();

    return (
        <div className="leftPanel">
            <DavitButtonGroup>
                <DavitSidePanelButton
                    icon="write"
                    onClick={setModeToEdit}
                    active={mode.includes(Mode.EDIT.toString())}
                />
                <DavitSidePanelButton icon="eye" onClick={setModeToView} active={mode === Mode.VIEW} />
                <DavitSidePanelButton icon="file" onClick={setModeToFile} active={mode === Mode.FILE} />
                <DavitSidePanelButton icon="external alternate" onClick={setModeToTab} active={mode === Mode.TAB} />
            </DavitButtonGroup>

            <div style={{ position: 'absolute', bottom: '1em' }}>
                <img src={logo} alt="fireSpot" />
                <div className="verticalLabel">DAVIT by</div>
            </div>
            <label style={{ color: 'white', position: 'absolute', bottom: '0.5em', marginLeft: '5px' }}>
                {DAVIT_VERISON}
            </label>
        </div>
    );
};

const useSidePanelViewModel = () => {
    const dispatch = useDispatch();
    const mode = useSelector(editSelectors.selectMode);

    const setModeToEdit = () => {
        dispatch(EditActions.setMode.edit());
    };

    const setModeToView = () => {
        dispatch(EditActions.setMode.view());
    };

    const setModeToFile = () => {
        dispatch(EditActions.setMode.file());
    };

    const setModeToTab = () => {
        dispatch(EditActions.setMode.tab());
    };

    return {
        setModeToEdit,
        setModeToView,
        setModeToFile,
        setModeToTab,
        mode,
    };
};
