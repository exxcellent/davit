import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChainCTO } from "../../../dataAccess/access/cto/ChainCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { ChainConfigurationTO } from "../../../dataAccess/access/to/ChainConfigurationTO";
import { ChainStateTO } from "../../../dataAccess/access/to/ChainStateTO";
import { ChainTO } from "../../../dataAccess/access/to/ChainTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { SequenceConfigurationTO } from "../../../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "../../../dataAccess/access/to/SequenceStateTO";
import { StateTO } from "../../../dataAccess/access/to/StateTO";
import { editActions, EditActions, editSelectors } from "../../../slices/EditSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { EditChainConfiguration } from "../../../slices/thunks/ChainConfigurationThunks";
import { EditSequenceConfiguration } from "../../../slices/thunks/SequenceConfigurationThunks";
import { DavitUtil } from "../../../utils/DavitUtil";
import {
    ActorDropDown,
    ChainDropDown,
    DavitAddButton,
    DavitDeleteButton,
    DavitIconButton,
    DavitShowMoreButton,
    InstanceDropDown,
    SequenceDropDown,
} from "../../atomic";
import { DavitToggleButton } from "../../atomic/buttons/DavitToggleButton";
import { DavitIcons } from "../../atomic/icons/IconSet";
import { NoteIcon } from "../../atomic/icons/NoteIcon";
import "./Configuration.css";
import { StateConfigurationView } from "./fragments/StateConfigurationView";

export interface ConfigurationPanelProps {

}

export const ConfigurationPanel: FunctionComponent<ConfigurationPanelProps> = () => {

        const dispatch = useDispatch();

        const [sequenceOptions, setSequenceOptions] = useState<boolean>(false);
        const [showMore, setShowMore] = useState<boolean>(true);

        const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);
        const sequenceConfigurationToEdit: SequenceConfigurationTO | null = useSelector(editSelectors.selectSequenceConfigurationToEdit);

        const selectedChain: ChainCTO | null = useSelector(sequenceModelSelectors.selectChainCTO);
        const chainConfigurationToEdit: ChainConfigurationTO | null = useSelector(editSelectors.selectChainConfiguration);

        const runCalc = () => {
            if (selectedSequence !== null && sequenceConfigurationToEdit !== null) {
                dispatch(SequenceModelActions.setCurrentSequenceById(selectedSequence.sequenceTO.id));
                dispatch(SequenceModelActions.setCurrentSequenceConfiguration(sequenceConfigurationToEdit));
                dispatch(EditActions.setMode.view());
            }

            if (selectedChain !== null && chainConfigurationToEdit !== null) {
                const copyChainTO: ChainTO = DavitUtil.deepCopy(selectedChain.chain);
                dispatch(SequenceModelActions.setCurrentChainConfiguration(chainConfigurationToEdit));
                dispatch(EditActions.setMode.view());
                dispatch(SequenceModelActions.setCurrentChain(copyChainTO));
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


        const createSequenceInitData = () => {
            if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
                const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
                copySequenceConfiguration.initDatas.push(new InitDataTO());
                dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
            }
        };

        const deleteSequenceInitData = (index: number) => {
            if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
                const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
                copySequenceConfiguration.initDatas = copySequenceConfiguration.initDatas.filter((iData, iex) => iex !== index);
                dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
            }
        };

        const saveSequenceInitData = (initData: InitDataTO, index: number) => {
            if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {
                const copySequenceConfiguration: SequenceConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
                copySequenceConfiguration.initDatas[index] = initData;
                dispatch(EditSequenceConfiguration.update(copySequenceConfiguration));
            }
        };

        const buildSequenceActorDataTableRow = (initData: InitDataTO, index: number): JSX.Element => {
            let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

            return (
                <tr key={copyInitData.id}>
                    <td>
                        <div className="flex content-space-between">
                            <ActorDropDown
                                onSelect={(actor) => {
                                    copyInitData.actorFk = actor ? actor.actor.id : -1;
                                    saveSequenceInitData(copyInitData, index);
                                }}
                                placeholder={"Select Actor..."}
                                value={copyInitData.actorFk}
                            />
                            <InstanceDropDown
                                onSelect={(dataAndInstance) => {
                                    if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                        copyInitData.dataFk = dataAndInstance!.dataFk;
                                        copyInitData.instanceFk = dataAndInstance!.instanceId;
                                        saveSequenceInitData(copyInitData, index);
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
                                deleteSequenceInitData(index);
                            }}
                                               noConfirm
                            />
                        </div>
                    </td>
                </tr>
            );
        };

        // ------------------------------- chain ------------------------------

        const setChain = (chain: ChainTO | undefined) => {
            if (chain !== undefined) {
                const copyChain: ChainTO = DavitUtil.deepCopy(chain);
                dispatch(SequenceModelActions.setCurrentChain(copyChain));
                dispatch(EditChainConfiguration.create(copyChain.id));
            } else {
                dispatch(SequenceModelActions.resetCurrentChain);
                dispatch(editActions.clearObjectToEdit());
            }
        };

        const getUpdateChainStatesByConfiguration = (states: ChainStateTO[]): ChainStateTO[] => {
            const statesToUpdate: ChainStateTO[] = DavitUtil.deepCopy(states);
            if (selectedChain && chainConfigurationToEdit) {
                statesToUpdate.map(state => {
                    chainConfigurationToEdit.stateValues.forEach(sv => {
                        if (sv.chainStateFk === state.id) {
                            state.isState = sv.value;
                        }
                    });
                    return state;
                });
            }
            return statesToUpdate;
        };

        const setIsStateInChainConfiguration = (stateToToggle: StateTO, is: boolean) => {
            if (sequenceConfigurationToEdit) {
                const updatedChainConfiguration: ChainConfigurationTO = DavitUtil.deepCopy(sequenceConfigurationToEdit);
                updatedChainConfiguration.stateValues.forEach(sv => {
                    if (sv.chainStateFk === stateToToggle.id) {
                        sv.value = is;
                    }
                    return sv;
                });
                dispatch(EditChainConfiguration.update(updatedChainConfiguration));
            }
        };

        const createChainInitData = () => {
            if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit)) {
                const copyChainConfiguration: ChainConfigurationTO = DavitUtil.deepCopy(chainConfigurationToEdit);
                copyChainConfiguration.initDatas.push(new InitDataTO());
                dispatch(EditChainConfiguration.update(copyChainConfiguration));
            }
        };

        const deleteChainInitData = (index: number) => {
            if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit)) {
                const copyChainConfiguration: ChainConfigurationTO = DavitUtil.deepCopy(chainConfigurationToEdit);
                copyChainConfiguration.initDatas = copyChainConfiguration.initDatas.filter((iData, iex) => iex !== index);
                dispatch(EditChainConfiguration.update(copyChainConfiguration));
            }
        };

        const saveChainInitData = (initData: InitDataTO, index: number) => {
            if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit)) {
                const copyChainConfiguration: ChainConfigurationTO = DavitUtil.deepCopy(chainConfigurationToEdit);
                copyChainConfiguration.initDatas[index] = initData;
                dispatch(EditChainConfiguration.update(copyChainConfiguration));
            }
        };

        const buildChainActorDataTableRow = (initData: InitDataTO, index: number): JSX.Element => {
            let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

            return (
                <tr key={copyInitData.id}>
                    <td>
                        <div className="flex content-space-between">
                            <ActorDropDown
                                onSelect={(actor) => {
                                    copyInitData.actorFk = actor ? actor.actor.id : -1;
                                    saveChainInitData(copyInitData, index);
                                }}
                                placeholder={"Select Actor..."}
                                value={copyInitData.actorFk}
                            />
                            <InstanceDropDown
                                onSelect={(dataAndInstance) => {
                                    if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                        copyInitData.dataFk = dataAndInstance!.dataFk;
                                        copyInitData.instanceFk = dataAndInstance!.instanceId;
                                        saveChainInitData(copyInitData, index);
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
                                deleteChainInitData(index);
                            }}
                                               noConfirm
                            />
                        </div>
                    </td>
                </tr>
            );
        };


        // ---------------------------- ui parts ----------------------------

        const toggleSequenceChain = () => {
            setSequenceOptions(!sequenceOptions);
            dispatch(SequenceModelActions.resetAll);
        };

        const getSequenceStates = () => {
            if (!DavitUtil.isNullOrUndefined(selectedSequence) && !DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit)) {

                if (selectedSequence!.sequenceStates.length > 0) {
                    return (
                        <StateConfigurationView states={getUpdateStatesByConfiguration(selectedSequence!.sequenceStates || [])}
                                                setStateCallback={setIsStateInSequenceConfiguration}
                        />
                    );
                }

                if (selectedSequence!.sequenceStates.length === 0) {
                    return (
                        <div className="flex flex-center align-center">
                            <h2 className="padding-medium">-- no states declared --</h2>
                        </div>
                    );
                }
            }
        };

        const getChainStates = () => {
            if (!DavitUtil.isNullOrUndefined(selectedChain) && !DavitUtil.isNullOrUndefined(chainConfigurationToEdit)) {

                if (chainConfigurationToEdit!.stateValues.length > 0) {
                    return (
                        <StateConfigurationView states={getUpdateChainStatesByConfiguration(selectedChain!.chainStates || [])}
                                                setStateCallback={setIsStateInChainConfiguration}
                        />
                    );
                }

                if (chainConfigurationToEdit!.stateValues.length === 0) {
                    return (
                        <div className="flex flex-center align-center">
                            <h2 className="padding-medium">-- no states declared --</h2>
                        </div>
                    );
                }
            }
        };

        const getSequenceInitDatas = () => {
            if (!DavitUtil.isNullOrUndefined(sequenceConfigurationToEdit) && !DavitUtil.isNullOrUndefined(selectedSequence)) {

                if (sequenceConfigurationToEdit!.initDatas.length > 0) {
                    return sequenceConfigurationToEdit!.initDatas.map(buildSequenceActorDataTableRow);
                }

                if (sequenceConfigurationToEdit!.initDatas.length === 0) {
                    return (
                        <div className="flex flex-center align-center">
                            <h2 className="padding-medium">-- no init datas declared --</h2>
                        </div>
                    );
                }
            }
        };

        const getChainInitDatas = () => {
            if (!DavitUtil.isNullOrUndefined(chainConfigurationToEdit) && !DavitUtil.isNullOrUndefined(selectedChain)) {
                if (chainConfigurationToEdit!.initDatas.length > 0) {
                    return chainConfigurationToEdit!.initDatas.map(buildChainActorDataTableRow);
                }

                if (chainConfigurationToEdit!.initDatas.length === 0) {
                    return (
                        <div className="flex flex-center align-center">
                            <h2 className="padding-medium">-- no init datas declared --</h2>
                        </div>
                    );
                }
            }
        };

        const getNote = (): string => {
            let noteToReturn: string = "";
            if (!DavitUtil.isNullOrUndefined(selectedSequence)) {
                noteToReturn = selectedSequence!.sequenceTO!.note;
            }
            if (!DavitUtil.isNullOrUndefined(selectedChain)) {
                noteToReturn = selectedChain!.chain.note;
            }
            return noteToReturn;
        };

// ===============================================================================================================

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
                    {!sequenceOptions && <ChainDropDown onSelect={setChain}
                                                        value={selectedChain?.chain.id}
                    />}

                    <DavitShowMoreButton onClick={setShowMore}
                                         show={showMore}
                    />

                </div>

                {/* --------------- Body ---------------*/}
                {(selectedSequence || selectedChain) && showMore && <div className="configurationBody flex">

                    <div className="configurationStateColumn flex flex-column width-fluid">

                        {/*------ note -----*/}
                        <div className="flex flex-center padding-small">
                            <NoteIcon size="2x"
                                      className="margin-medium padding-small border border-medium"
                            />
                            <textarea className="noteTextarea border border-medium padding-medium"
                                      value={getNote()}
                            >
                                {/*<label>{getNote()}</label>*/}
                            </textarea>
                        </div>

                        <div>
                            {/*/!*----- States -----*!/*/}
                            <div className="configurationHeader flex flex-center align-center">
                                <h1 className="padding-medium">{selectedSequence ? "Sequence States" : "Chain States"}</h1>
                            </div>

                            {/*    State*/}
                            <div className="padding-bottom-l">
                                {getSequenceStates()}
                                {getChainStates()}
                            </div>

                        </div>

                        <div className="flex-inline flex-wrap flex-column">
                            {/*    Data setup*/}
                            <div className="configurationHeader flex flex-center align-center">
                                <h1 className="padding-medium">Data-Setup</h1>
                            </div>

                            <div className="configurationPanelHeader content-space-around align-center border-bottom border-medium">
                                <label>Actor</label>
                                <label>Data Instance</label>
                                <DavitAddButton onClick={selectedSequence ? createSequenceInitData : createChainInitData} />
                            </div>

                            <div className="padding-bottom-l">
                                {getSequenceInitDatas()}
                                {getChainInitDatas()}
                            </div>

                        </div>
                        <DavitIconButton onClick={runCalc}
                                         iconLeft={false}
                                         iconName={DavitIcons.play}
                                         className="calcButton"
                        >Calculate</DavitIconButton>
                    </div>
                </div>}

            </div>
        );
    }
;
