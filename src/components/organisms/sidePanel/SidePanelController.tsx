import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../assets/exxcellent_logo_200.png";
import { DAVIT_VERISON } from "../../../DavitConstants";
import { EditActions, editSelectors, Mode } from "../../../slices/EditSlice";
import { ElementSize } from "../../../style/Theme";
import { DavitIconButton } from "../../atomic";
import { DavitIcons } from "../../atomic/icons/IconSet";
import "./SidePanel.css";

export interface SidePanelProps {
}

export const SidePanelController: FunctionComponent<SidePanelProps> = () => {
    const {setModeToEdit, setModeToFile, setModeToView, mode} = useSidePanelViewModel();

    return (
        <div className="leftPanel">
            <DavitIconButton iconName={DavitIcons.pencil}
                             size={ElementSize.large}
                             className={"sidePanelButton" + (mode.includes(Mode.EDIT.toString()) ? " active" : "")}
                             onClick={setModeToEdit}
            />
            <DavitIconButton iconName={DavitIcons.eye}
                             className={"sidePanelButton" + (mode === Mode.VIEW ? " active" : "")}
                             onClick={setModeToView}
            />
            <DavitIconButton iconName={DavitIcons.file}
                             className={"sidePanelButton" + (mode === Mode.FILE ? " active" : "")}
                             onClick={setModeToFile}
            />
            {/*TODO: enable wenn tabs are fixed!*/}
            {/*<DavitSidePanelButton icon="external alternate" onClick={setModeToTab} active={mode === Mode.TAB} />*/}

            <div style={{position: "absolute", bottom: "1em"}}>
                <img src={logo}
                     alt="fireSpot"
                />
                <div className="verticalLabel">DAVIT by</div>
                <label style={{color: "white", position: "absolute", bottom: "0"}}>
                    v {DAVIT_VERISON}
                </label>
            </div>
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
