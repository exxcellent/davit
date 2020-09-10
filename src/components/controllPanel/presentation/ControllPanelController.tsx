import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { EditActions, editSelectors, Mode } from "../../../slices/EditSlice";
import { ControllPanelEditController } from "./fragments/edit/ControllPanelEditController";
import { ControllPanelFileController } from "./fragments/file/ControllPanelFileController";
import { ControllPanelTabController } from "./fragments/tabs/ControllPanelTabController";
import { ControllPanelSequenceOptions } from "./fragments/view/ControllPanelSequenceOptions";

export interface ControllPanelProps {}

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (props) => {
  const { mode } = useControllPanelViewModel();

  // const getModesArray = (mode: string): string[] => {
  //   return mode.split("_");
  // };

  // const getModesDivs = (mode: Mode, onClickNavItem: (mode: string) => void): React.ReactNode => {
  //   let navDivs = getModesArray(mode).map((splitedModeItem) => {
  //     return (
  //       <div onClick={() => onClickNavItem(splitedModeItem)} key={splitedModeItem} className="verticalTab">
  //         {splitedModeItem}
  //       </div>
  //     );
  //   });
  //   while (navDivs.length < 5) {
  //     navDivs.push(<div className="verticalTablDummy"></div>);
  //   }
  //   return navDivs;
  // };

  const useGetViewByMode = (mode: Mode) => {
    if (!isNullOrUndefined(mode)) {
      if (mode.includes("EDIT")) {
        return <ControllPanelEditController />;
      }
      if (mode.includes("VIEW")) {
        return <ControllPanelSequenceOptions hidden={!mode.includes("VIEW")} />;
      }
      if (mode.includes("FILE")) {
        return <ControllPanelFileController hidden={!mode.includes("FILE")} />;
      }
      if (mode.includes("TAB")) {
        return <ControllPanelTabController hidden={!mode.includes("TAB")} />;
      }
    }
  };

  return (
    <div className="controllerHeader">
      <div style={{ display: "flex", width: "100%", padding: "0" }}>
        {/* {getModesDivs(mode, onClickNavItem)} */}
        {/* <ControllPanelEditController />
      <ControllPanelSequenceOptions hidden={mode.includes("VIEW")} />
      <ControllPanelFileController hidden={!mode.includes("FILE")} />
      <ControllPanelTabController hidden={mode.includes("TAB")} /> */}
        {useGetViewByMode(mode)}
      </div>
    </div>
  );
};

const useControllPanelViewModel = () => {
  const mode: Mode = useSelector(editSelectors.mode);
  const dispatch = useDispatch();

  const onClickNavItem = (mode: string) => {
    switch (mode) {
      case "EDIT":
        dispatch(EditActions.setMode.edit());
        break;
      case "DATA":
        dispatch(EditActions.setMode.editData());
        break;
      case "DATASETUP":
        dispatch(EditActions.setMode.editDataSetup());
        break;
      case "SEQUENCE":
        dispatch(EditActions.setMode.editSequence());
        break;
      // TODO: check how to activate these since they need an object
      // case "STEP":
      //   dispatch(EditActions.setMode.editStep());
      //   break;
      // case "DECISION":
      //   dispatch(EditActions.setMode.editDecision());
      //   break;
      case "CHAIN":
        dispatch(EditActions.setMode.editChain());
        break;
      // case "DECISION":
      //   dispatch(EditActions.setMode.editChainDecision());
      //   break;
      default:
        break;
    }
  };

  return { mode, onClickNavItem };
};
