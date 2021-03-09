import React, {FunctionComponent, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ChainDecisionTO} from "../../../../../../dataAccess/access/to/ChainDecisionTO";
import {ChainTO} from "../../../../../../dataAccess/access/to/ChainTO";
import {EditActions, editSelectors} from "../../../../../../slices/EditSlice";
import {sequenceModelSelectors} from "../../../../../../slices/SequenceModelSlice";
import {EditChainDecision} from "../../../../../../slices/thunks/ChainDecisionThunks";
import {DavitUtil} from "../../../../../../utils/DavitUtil";
import {DavitBackButton} from "../../../../../common/fragments/buttons/DavitBackButton";
import {DavitMenuLabel} from "../../../../../common/fragments/DavitMenuLabel";
import {ActorDropDown} from "../../../../../common/fragments/dropdowns/ActorDropDown";
import {
    DataAndInstanceId,
    InstanceDropDownMultiselect,
} from "../../../../../common/fragments/dropdowns/InstanceDropDown";
import {ControlPanelEditSub} from "../common/ControlPanelEditSub";
import {OptionField} from "../common/OptionField";
import {GlobalActions} from "../../../../../../slices/GlobalSlice";

export interface ControllPanelEditChainConditionProps {
    hidden: boolean;
}

export const ControllPanelEditChainCondition: FunctionComponent<ControllPanelEditChainConditionProps> = (props) => {
    const {hidden} = props;
    const {
        label,
        setMode,
        actorFk,
        setActorFk,
        setData,
        selectedInstances,
    } = useControllPanelEditConditionViewModel();

    return (
        <ControlPanelEditSub label={label} hidden={hidden} onClickNavItem={setMode}>
            <div className="controllPanelEditChild">
                <OptionField label="Select Actor">
                    <ActorDropDown
                        value={actorFk}
                        onSelect={(actor) => setActorFk(actor?.actor.id || -1)}
                    />
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <DavitMenuLabel text="HAS"/>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Select data for actor">
                    <InstanceDropDownMultiselect
                        onSelect={(data) => {
                            setData(data);
                        }}
                        selected={selectedInstances || []}
                    />
                </OptionField>
            </div>
            <div className="columnDivider optionFieldSpacer">
                <OptionField label="Navigation">
                    <DavitBackButton onClick={setMode}/>
                </OptionField>
            </div>
        </ControlPanelEditSub>
    );
};

const useControllPanelEditConditionViewModel = () => {
    const decisionToEdit: ChainDecisionTO | null = useSelector(editSelectors.selectChainDecisionToEdit);
    const chain: ChainTO | null = useSelector(sequenceModelSelectors.selectChain);
    const dispatch = useDispatch();

    useEffect(() => {
        if (DavitUtil.isNullOrUndefined(decisionToEdit)) {
            dispatch(GlobalActions.handleError("Tried to go to edit chain decision without decisionToEdit specified"));
            dispatch(EditActions.setMode.edit());
        }
    }, [dispatch, decisionToEdit]);

    const setData = (dataAndInstanceIds: DataAndInstanceId[] | undefined) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecisionToEdit.dataAndInstanceIds = dataAndInstanceIds || [];
            dispatch(EditChainDecision.create(copyDecisionToEdit));
        }
    };

    const setMode = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            if (newMode && newMode === "EDIT") {
                dispatch(EditActions.setMode.edit());
            } else if (newMode && newMode === "CHAIN") {
                dispatch(EditActions.setMode.editChain(chain || undefined));
            } else {
                dispatch(EditActions.setMode.editChainDecision(decisionToEdit!));
            }
        } else {
            console.info("decisionToEdit is null!");
        }
    };

    const setActorFk = (actorId: number) => {
        if (!DavitUtil.isNullOrUndefined(decisionToEdit)) {
            const copyDecisionToEdit: ChainDecisionTO = DavitUtil.deepCopy(decisionToEdit);
            copyDecisionToEdit.actorFk = actorId;
            dispatch(EditChainDecision.create(copyDecisionToEdit));
        }
    };

    return {
        label: "EDIT * " + (chain?.name || "") + " * " + (decisionToEdit?.name || "") + " * CONDITION",
        setMode,
        actorFk: decisionToEdit?.actorFk,
        setActorFk,
        setData,
        selectedInstances: decisionToEdit?.dataAndInstanceIds,
    };
};
