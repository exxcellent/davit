import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { SequenceConfigurationTO } from "../../../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "../../../dataAccess/access/to/SequenceStateTO";
import { StateTO } from "../../../dataAccess/access/to/StateTO";
import { editActions, EditActions, editSelectors } from "../../../slices/EditSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { EditSequenceConfiguration } from "../../../slices/thunks/SequenceConfigurationThunks";
import { DavitUtil } from "../../../utils/DavitUtil";
import {
    ActorDropDown,
    ChainDropDown,
    DavitAddButton,
    DavitBackButton,
    DavitDeleteButton,
    DavitIconButton,
    InstanceDropDown,
    SequenceDropDown,
} from "../../atomic";
import { DavitToggleButton } from "../../atomic/buttons/DavitToggleButton";
import { DavitIcons } from "../../atomic/icons/IconSet";
import "./Configuration.css";
import { StateConfigurationView } from "./fragments/StateConfigurationView";

export interface ConfigurationPanelProps {

}

export const ConfigurationPanel: FunctionComponent<ConfigurationPanelProps> = () => {

    const dispatch = useDispatch();

    const [sequenceOptions, setSequenceOptions] = useState<boolean>(true);

    const sequenceConfigurationToEdit: SequenceConfigurationTO | null = useSelector(editSelectors.selectSequenceConfigurationToEdit);

    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

    const runCalc = () => {
        if (selectedSequence !== null && sequenceConfigurationToEdit !== null) {
            dispatch(SequenceModelActions.setCurrentSequenceById(selectedSequence.sequenceTO.id));
            dispatch(SequenceModelActions.setCurrentSequenceConfiguration(sequenceConfigurationToEdit));
            dispatch(EditActions.setMode.view());
        }
    };

    // ------------------------------- sequence ------------------------------

    const setIsStateInSequenceConfiguration = (stateToToggle: StateTO, is: boolean) => {
        if (sequenceConfigurationToEdit) {
            const updatedSequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            updatedSequenceConfiguration.stateValues.forEach(sv => {
                if (sv.sequenceStateFk === stateToToggle.id) {
                    sv.value = is;
                }
                return sv;
            });
            dispatch(EditSequenceConfiguration.update(updatedSequenceConfiguration));
        }
    };

    const setSequence = (sequenceId: number | undefined) => {
        if (sequenceId !== undefined) {
            dispatch(SequenceModelActions.setCurrentSequenceById(sequenceId));
            dispatch(EditSequenceConfiguration.create(sequenceId));
        } else {
            dispatch(SequenceModelActions.resetCurrentSequence);
            dispatch(SequenceModelActions.resetCurrentSequenceConfiguration);
            dispatch(editActions.clearObjectToEdit());
        }
    };

    const getUpdateStatesByConfiguration = (states: SequenceStateTO[]): SequenceStateTO[] => {
        const statesToUpdate: SequenceStateTO[] = DavitUtil.deepCopy(states);
        if (selectedSequence && sequenceConfigurationToEdit) {
            statesToUpdate.map(state => {
                sequenceConfigurationToEdit.stateValues.forEach(sv => {
                    if (sv.sequenceStateFk === state.id) {
                        state.isState = sv.value;
                    }
                });
                return state;
            });
        }
        return statesToUpdate;
    };


    const createInitData = () => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            copySequenceConfiguration.initDatas.push(new InitDataTO());
            dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
        }
    };

    const deleteInitData = (index: number) => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            copySequenceConfiguration.initDatas = copySequenceConfiguration.initDatas.filter((iData, iex) => iex !== index);
            dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
        }
    };

    const saveInitData = (initData: InitDataTO, index: number) => {
        if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
            const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
            copySequenceConfiguration.initDatas[index] = initData;
            dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
        }
    };

    const buildActorDataTableRow = (initData: InitDataTO, index: number): JSX.Element => {
        let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

        return (
            <tr key={copyInitData.id}>
                <td>
                    <div className="flex content-space-between">
                        <ActorDropDown
                            onSelect={(actor) => {
                                copyInitData.actorFk = actor ? actor.actor.id : -1;
                                saveInitData(copyInitData, index);
                            }}
                            placeholder={"Select Actor..."}
                            value={copyInitData.actorFk}
                        />
                        <InstanceDropDown
                            onSelect={(dataAndInstance) => {
                                if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                    copyInitData.dataFk = dataAndInstance!.dataFk;
                                    copyInitData.instanceFk = dataAndInstance!.instanceId;
                                    saveInitData(copyInitData, index);
                                }
                            }}
                            placeholder={"Select Data Instance..."}
                            value={JSON.stringify({
                                dataFk: copyInitData!.dataFk,
                                instanceId: copyInitData!.instanceFk,
                            })
                            }
                        />
                        <DavitDeleteButton onClick={() => {
                            deleteInitData(index);
                        }}
                                           noConfirm
                        />
                    </div>
                </td>
            </tr>
        );
    };

    // ---------------------------- private ----------------------------

    const toggleSequenceChain = () => {
        setSequenceOptions(!sequenceOptions);
        dispatch(SequenceModelActions.resetAll);
    };

    return (
        <div className="configurationPanel border border-medium">

            {/*----- Header -----*/}
            <div className="configurationPanelHeader content-space-around align-center padding-medium border-bottom border-medium">

                <div className="flex align-center">
                    <h3 className={sequenceOptions ? "" : "selectedColor"}>Chain</h3>
                    <div className="padding-horizontal-m">

                        <DavitToggleButton
                            toggle={toggleSequenceChain}
                            value={sequenceOptions}
                        />
                    </div>
                    <h3 className={sequenceOptions ? "selectedColor" : ""}>Sequence</h3>
                </div>

                {sequenceOptions && <SequenceDropDown onSelect={(sequence) => {
                    setSequence(sequence?.id);
                }}
                                                      value={selectedSequence?.sequenceTO.id}

                />}
                {!sequenceOptions && <ChainDropDown onSelect={() => {
                }}
                />}

                <DavitBackButton
                    onClick={() => {
                        dispatch(EditActions.setMode.view());
                        dispatch(SequenceModelActions.resetCurrentSequence);
                        dispatch(SequenceModelActions.resetCurrentSequenceConfiguration);
                    }}
                />

                <DavitIconButton onClick={runCalc}
                                 iconLeft={true}
                                 iconName={DavitIcons.play}
                />
            </div>
            {selectedSequence && <div className="configurationBody flex">

                {/*/!*----- States -----*!/*/}
                <div className="configurationStateColumn flex flex-column width-fluid">
                    <div>
                        {/*    State*/}
                        <StateConfigurationView states={getUpdateStatesByConfiguration(selectedSequence?.sequenceStates || [])}
                                                setStateCallback={setIsStateInSequenceConfiguration}
                        />
                    </div>
                    <div className="flex-inline flex-wrap flex-column">
                        {/*    Data setup*/}
                        <div className="configurationPanelHeader content-space-around align-center border-bottom border-medium">
                            <label>Actor</label>
                            <label>Data Instance</label>
                            <DavitAddButton onClick={createInitData} />
                        </div>
                        {sequenceConfigurationToEdit &&
                        sequenceConfigurationToEdit.initDatas.map(buildActorDataTableRow)
                        }
                    </div>
                </div>

            </div>}
        </div>
    );
};
