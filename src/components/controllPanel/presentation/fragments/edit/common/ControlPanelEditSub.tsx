import React, {FunctionComponent} from "react";
import {useSelector} from "react-redux";
import {editSelectors, Mode} from "../../../../../../slices/EditSlice";

interface ControlPanelEditProps {
    label: string;
    onClickNavItem?: (newMode: string) => void;
    hidden: boolean;
}

export const ControlPanelEditSub: FunctionComponent<ControlPanelEditProps> = (props) => {
    const {children, onClickNavItem, hidden} = props;

    const {mode} = useControlPanelSubViewModel();

    const getModesArray = (mode: string): string[] => {
        return mode.split("_");
    };

    const getModesDivs = (mode: Mode, onClickNavItem?: (mode: string) => void): React.ReactNode => {
        return getModesArray(mode).map((spliitedModeItem) => {
            return (
                <div
                    onClick={onClickNavItem && (() => onClickNavItem(spliitedModeItem))}
                    key={spliitedModeItem}
                    className={"verticalTab " + (hidden ? "slideable-hidden" : "slideable-verticaltab")}>
                    {spliitedModeItem}
                </div>
            );
        });
    };

    return (
        <div style={{display: "flex", width: "100%", height: "8em"}}>
            {getModesDivs(mode, onClickNavItem)}

            <div className="controllPanelEdit">{children}</div>
        </div>
    );
};

const useControlPanelSubViewModel = () => {
    const mode: Mode = useSelector(editSelectors.selectMode);
    return {
        mode,
    };
};
