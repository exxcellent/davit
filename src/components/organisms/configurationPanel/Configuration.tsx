import React, { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataSetupTO } from "../../../dataAccess/access/to/DataSetupTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { SequenceStateTO } from "../../../dataAccess/access/to/SequenceStateTO";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";
import { StateTO } from "../../../dataAccess/access/to/StateTO";
import { Configuration, editActions, EditActions, editSelectors } from "../../../slices/EditSlice";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { SequenceModelActions } from "../../../slices/SequenceModelSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import {
    ActorDropDown,
    DataSetupLabelDropDown,
    DavitAddButton,
    DavitButton,
    DavitDeleteButton,
    DavitIconButton,
    DavitTextInput,
    InstanceDropDown
} from "../../atomic";
import { DavitIcons } from "../../atomic/icons/IconSet";
import { AddOrEdit } from "../../molecules";
import { useDataSetupViewModel } from "../controllPanel/presentation/fragments/edit/fragments/viewmodels/DataSetupViewModel";
import { useSequenceViewModel } from "../controllPanel/presentation/fragments/edit/fragments/viewmodels/SequenceViewModel";
import "./Configuration.css";
import { StateConfigurationView } from "./fragments/StateConfigurationView";

export interface ConfigurationPanelProps {

}

export const ConfigurationPanel: FunctionComponent<ConfigurationPanelProps> = () => {

    const dispatch = useDispatch();

    const {saveSequenceState} = useSequenceViewModel();
    const {
        name,
        changeName,
        deleteDataSetup,
        updateDataSetup,
        initDatas,
        saveInitData,
        deleteInitData,
        createInitData,
    } = useDataSetupViewModel();

    const configurationToEdit: Configuration | null = useSelector(editSelectors.selectConfigurationToEdit);
    // const chains: ChainTO[] = useSelector(masterDataSelectors.selectChains);
    const sequences: SequenceTO[] = useSelector(masterDataSelectors.selectSequences);
    const sequenceStates: SequenceStateTO[] = useSelector(masterDataSelectors.selectSequenceStateBySequenceId(configurationToEdit?.sequence.id || -1));

    const setIsState = (stateToToggle: StateTO, is: boolean) => {
        const copyStateToToggle: StateTO = DavitUtil.deepCopy(stateToToggle);
        copyStateToToggle.isState = is;
        saveSequenceState(copyStateToToggle as SequenceStateTO);
    };

    const setDataSetup = (dataSetup?: DataSetupTO) => {
        dispatch(EditActions.setMode.setDataSetupInConfiguration(dataSetup ? dataSetup.id : undefined));
    };

    const runCalc = () => {
        console.info(configurationToEdit);

        if (!DavitUtil.isNullOrUndefined(configurationToEdit)
            && !DavitUtil.isNullOrUndefined(configurationToEdit?.sequence
                && !DavitUtil.isNullOrUndefined(configurationToEdit.dataSetup))) {

            dispatch(SequenceModelActions.setCurrentSequence(configurationToEdit!.sequence.id));
            dispatch(SequenceModelActions.setCurrentDataSetup(configurationToEdit!.dataSetup.dataSetup.id));
            dispatch(EditActions.setMode.view());
        }
    };

    const buildSequenceButton = (sequence: SequenceTO): JSX.Element => {
        return (
            <DavitButton key={sequence.id}
                         onClick={() => {
                             let copyConfig: Configuration = DavitUtil.deepCopy(configurationToEdit);
                             const copySequence: SequenceTO = DavitUtil.deepCopy(sequence);
                             copyConfig.sequence = copySequence;
                             dispatch(editActions.setConfigurationToEdit(copyConfig));
                             dispatch(SequenceModelActions.setCurrentSequence(copySequence.id));
                         }}
            >{sequence.name}</DavitButton>
        );
    };

    const buildActorDataTableRow = (initData: InitDataTO): JSX.Element => {
        let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

        return (
            <tr key={copyInitData.id}>
                <td>
                    <div className="flex content-space-between">
                        <ActorDropDown
                            onSelect={(actor) => {
                                copyInitData.actorFk = actor ? actor.actor.id : -1;
                                saveInitData(copyInitData);
                            }}
                            placeholder={"Select Actor..."}
                            value={copyInitData.actorFk}
                        />
                        <InstanceDropDown
                            onSelect={(dataAndInstance) => {
                                if (!DavitUtil.isNullOrUndefined(dataAndInstance)) {
                                    copyInitData.dataFk = dataAndInstance!.dataFk;
                                    copyInitData.instanceFk = dataAndInstance!.instanceId;
                                    saveInitData(copyInitData);
                                }
                            }}
                            placeholder={"Select Data Instance..."}
                            value={JSON.stringify({
                                dataFk: copyInitData!.dataFk,
                                instanceId: copyInitData!.instanceFk,
                            })
                            }
                        />
                        {copyInitData.id !== -1 && <DavitDeleteButton onClick={() => {
                            deleteInitData(copyInitData);
                        }}
                                                                      noConfirm
                        />}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="configurationPanel flex flex-column content-space-around border border-medium">
            {/*----- Header -----*/}
            <div className="configurationPanelHeader flex content-space-around width-fluid align-center border border-medium padding-small">

                <h1>Configuration</h1>

                <DavitButton onClick={() => {
                    dispatch(EditActions.setMode.edit());
                    dispatch(SequenceModelActions.resetCurrentSequence);
                    dispatch(SequenceModelActions.resetCurrentDataSetup);
                }}
                >Cancel</DavitButton>

                <DavitIconButton onClick={runCalc}
                                 iconLeft={true}
                                 iconName={DavitIcons.play}
                >
                    <label>
                        Calculate
                    </label>
                </DavitIconButton>
            </div>

            <div className="configurationBody flex">

                {/*----- Sequence / Chain -----*/}
                <div className="configurationSequenceChainColumn flex flex-column">
                    {/*{(chains.length > 0) &&*/}
                    {/*<div className="configurationPanelHeader padding-medium border border-medium">*/}
                    {/*    <h2>Chains</h2>*/}
                    {/*</div>*/}
                    {/*}*/}
                    {/*{(chains.length > 0) && chains.map(buildChainButton)}*/}
                    {sequences.length > 0 &&
                    <div className="configurationPanelHeader padding-medium border border-medium">
                        <h2>Sequences</h2>
                    </div>
                    }
                    {sequences.length > 0 && sequences.map(buildSequenceButton)}
                </div>

                {/*----- States -----*/}
                <div className="configurationStateColumn flex flex-column border border-medium">
                    <div>
                        {/*    State*/}
                        <StateConfigurationView states={sequenceStates}
                                                setStateCallback={setIsState}
                        />
                    </div>
                    <div>
                        {/*    Data setup*/}
                        <div className="configurationPanelHeader padding-medium border border-medium width-fluid">
                            <h2>Data-Setup</h2>
                        </div>

                        <div className="flex content-space-around align-center">
                            <AddOrEdit
                                addCallBack={() => setDataSetup()}
                                dropDown={<DataSetupLabelDropDown
                                    onSelect={(dataSetup) => setDataSetup(dataSetup)}
                                    label="Data-Setup"
                                />}
                            />

                            <DavitTextInput
                                label="Name:"
                                placeholder="Data Setup Name ..."
                                onChangeCallback={(name: string) => changeName(name)}
                                value={name}
                                focus={true}
                                onBlur={updateDataSetup}
                            />

                            {configurationToEdit?.dataSetup.dataSetup.name !== undefined &&
                            <DavitDeleteButton onClick={deleteDataSetup} />}

                        </div>

                        <table className="border"
                               style={{width: "40em", minHeight: "30vh"}}
                        >
                            <thead>
                            <tr>
                                <td style={{textAlign: "center"}}>Actor</td>
                                <td style={{textAlign: "center"}}>Data Instance</td>
                                <td className={"flex flex-end"}><DavitAddButton onClick={createInitData} /></td>
                            </tr>
                            </thead>
                            <tbody style={{maxHeight: "40vh"}}>
                            {initDatas.map(buildActorDataTableRow)}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};
