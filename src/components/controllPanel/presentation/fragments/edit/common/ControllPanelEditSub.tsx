import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { editSelectors, Mode } from "../../../../../../slices/EditSlice";

interface ControllPanelEditProps {
  label: string;
  onClickNavItem?: (newMode: string) => void;
  hidden: boolean;
}

export const ControllPanelEditSub: FunctionComponent<ControllPanelEditProps> = (props) => {
  const { children, onClickNavItem, hidden } = props;

  const { mode } = useControllPanelSubViewModel();

  const getModesArray = (mode: string): string[] => {
    return mode.split("_");
  };

  const getModesDivs = (mode: Mode, onClickNavItem?: (mode: string) => void): React.ReactNode => {
    let navDivs = getModesArray(mode).map((spliitedModeItem) => {
      return (
        <div
          onClick={onClickNavItem && (() => onClickNavItem(spliitedModeItem))}
          key={spliitedModeItem}
          className={"verticalTab " + (hidden ? "slideable-hidden" : "slideable-verticaltab")}
        >
          {spliitedModeItem}
        </div>
      );
    });
    // while (navDivs.length < 5) {
    //   navDivs.push(<div className="verticalTablDummy"></div>)
    // }
    return navDivs;
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "8em" }}>
      {getModesDivs(mode, onClickNavItem)}
      <div className={"optionFieldSpacer " + (hidden ? "slideable-hidden" : "slideable")} style={{ padding: "10px" }}>
        <div className="controllPanelEdit">{children}</div>
      </div>
    </div>
  );
};

const useControllPanelSubViewModel = () => {
  const mode: Mode = useSelector(editSelectors.mode);
  return {
    mode,
  };
};
