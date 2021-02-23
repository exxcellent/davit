import React, {FunctionComponent} from "react";
import {useDispatch, useSelector} from "react-redux";
import {EditActions, editSelectors, Mode} from "../../../slices/EditSlice";
import {DavitUtil} from "../../../utils/DavitUtil";
import {ControlPanelEditController} from "./fragments/edit/ControlPanelEditController";
import {ControlPanelFileController} from "./fragments/file/ControlPanelFileController";
import {ControllPanelTabController} from "./fragments/tabs/ControllPanelTabController";
import {ControllPanelViewOptions} from "./fragments/view/ControllPanelViewOptions";

export interface ControlPanelProps {}

export const ControlPanelController: FunctionComponent<ControlPanelProps> = () => {
    const { mode } = useControllPanelViewModel();

    const useGetViewByMode = (mode: Mode) => {
        if (!DavitUtil.isNullOrUndefined(mode)) {
            if (mode.includes("EDIT")) {
                return <ControlPanelEditController />;
            }
            if (mode.includes("VIEW")) {
                return <ControllPanelViewOptions hidden={!mode.includes("VIEW")} />;
            }
            if (mode.includes("FILE")) {
                return <ControlPanelFileController hidden={!mode.includes("FILE")} />;
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
    const mode: Mode = useSelector(editSelectors.selectMode);
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
