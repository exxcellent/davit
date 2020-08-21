import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isNullOrUndefined } from "util";
import { EditActions, editSelectors, Mode } from "../../../slices/EditSlice";
import { ControllPanelEditController } from "./fragments/edit/ControllPanelEditController";
import { ControllPanelFileController } from "./fragments/file/ControllPanelFileController";
import { ControllPanelTabController } from "./fragments/tabs/ControllPanelTabController";
import { ControllPanelSequenceOptions } from "./fragments/view/ControllPanelSequenceOptions";

export interface ControllPanelProps { }

export const ControllPanelController: FunctionComponent<ControllPanelProps> = (props) => {
  const { mode, onClickNavItem } = useControllPanelViewModel();

  const getModesArray = (mode: string): string[] => {
    return mode.split('_');
  }

  const getModesDivs = (mode: Mode, onClickNavItem: (mode: string) => void): React.ReactNode => {
    return getModesArray(mode).map(spliitedModeItem => {
      return (
        <div
          onClick={() => onClickNavItem(spliitedModeItem)}
          key={spliitedModeItem}
          className='verticalTab'>
          {spliitedModeItem}
        </div>
      );
    });
  }

  const useGetViewByMode = (mode: Mode) => {
    if (!isNullOrUndefined(mode)) {
      if (mode.includes("EDIT")) {
        return <ControllPanelEditController />
      }
      if (mode.includes("VIEW")) {
        return <ControllPanelSequenceOptions />;
      }
      if (mode.includes("FILE")) {
        return <ControllPanelFileController />;
      }
      if (mode.includes("TAB")) {
        return <ControllPanelTabController />;
      }
    }
  };

  return <div className="controllerHeader">
    <div style={{ display: 'flex', width: '100%', padding: '0' }}>
      {getModesDivs(mode, onClickNavItem)}
      {useGetViewByMode(mode)}
    </div>

  </div>;
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
  }

  return { mode, onClickNavItem };
};
