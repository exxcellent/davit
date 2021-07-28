import React, { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataSetupCTO } from "../../../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../../../dataAccess/access/cto/SequenceCTO";
import { InitDataTO } from "../../../dataAccess/access/to/InitDataTO";
import { SequenceStateTO } from "../../../dataAccess/access/to/SequenceStateTO";
import { SequenceTO } from "../../../dataAccess/access/to/SequenceTO";
import { StateTO } from "../../../dataAccess/access/to/StateTO";
import { EditActions } from "../../../slices/EditSlice";
import { masterDataSelectors } from "../../../slices/MasterDataSlice";
import { SequenceModelActions, sequenceModelSelectors } from "../../../slices/SequenceModelSlice";
import { DavitUtil } from "../../../utils/DavitUtil";
import {
    ActorDropDown,
    DavitAddButton,
    DavitButton,
    DavitDeleteButton,
    DavitIconButton,
    InstanceDropDown
} from "../../atomic";
import { DavitIcons } from "../../atomic/icons/IconSet";
import "./Configuration.css";
import { StateConfigurationView } from "./fragments/StateConfigurationView";

export interface ConfigurationPanelProps {

}

export const ConfigurationPanel: FunctionComponent<ConfigurationPanelProps> = () => {

    const dispatch = useDispatch();

    const [states, setStates] = useState<StateTO[]>([]);
    const [dataSetup, setDataSetup] = useState<DataSetupCTO>(new DataSetupCTO());

    const sequences: SequenceTO[] = useSelector(masterDataSelectors.selectSequences);
    const selectedSequence: SequenceCTO | null = useSelector(sequenceModelSelectors.selectSequence);

    const setIsState = (stateToToggle: StateTO, is: boolean) => {
        const copyStates: StateTO[] = DavitUtil.deepCopy(states);
        copyStates.map(state => {
            if (state.id === stateToToggle.id) {
                state.isState = is;
            }
            return state;
        });
        setStates(copyStates);
    };

    const runCalc = () => {
        if(selectedSequence !== null){
            const copySequence: SequenceCTO = DavitUtil.deepCopy(selectedSequence);
            dispatch(SequenceModelActions.setCurrentSequenceByIdWithStates(copySequence.sequenceTO.id, (states as SequenceStateTO[])));
            dispatch(SequenceModelActions.setCurrentDataSetup(dataSetup));
            dispatch(EditActions.setMode.view());
        }
    };

    const setSequence = (sequenceId: number) => {
        dispatch(SequenceModelActions.setCurrentSequenceById(sequenceId));
        if (selectedSequence) {
            const copyStates: StateTO[] = DavitUtil.deepCopy(selectedSequence.sequenceStates);
            setStates(copyStates);
        }
    };

    const buildSequenceButton = (sequence: SequenceTO): JSX.Element => {
        return (
            <DavitButton key={sequence.id}
                         onClick={() => setSequence(sequence.id)}
            >{sequence.name}</DavitButton>
        );
    };

    const saveInitData = (initData: InitDataTO) => {
        const copyDataSetup: DataSetupCTO = DavitUtil.deepCopy(dataSetup);
        copyDataSetup.initDatas.map(iData => {
            if (iData.id === initData.id) {
                iData.actorFk = initData.actorFk;
                iData.dataFk = initData.dataFk;
                iData.instanceFk = initData.instanceFk;
            }
            return iData;
        });
        setDataSetup(copyDataSetup);
    };

    const createInitData = () => {
        const copyDataSetup: DataSetupCTO = DavitUtil.deepCopy(dataSetup);
        const newInitData: InitDataTO = new InitDataTO();
        newInitData.id = copyDataSetup.initDatas.length;
        copyDataSetup.initDatas.push(newInitData);
        setDataSetup(copyDataSetup);
    };

    const deleteInitData = (initDataToDelete: InitDataTO) => {
        const copyDataSetup: DataSetupCTO = DavitUtil.deepCopy(dataSetup);
        copyDataSetup.initDatas.filter(iData => iData.id !== initDataToDelete.id);
        setDataSetup(copyDataSetup);
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
                    dispatch(EditActions.setMode.view());
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
                        <StateConfigurationView states={states}
                                                setStateCallback={setIsState}
                        />
                    </div>
                    <div>
                        {/*    Data setup*/}
                        <div className="configurationPanelHeader border border-medium width-fluid">
                            <h2>Data-Setup</h2>
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
                            {dataSetup.initDatas.map(buildActorDataTableRow)}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};
