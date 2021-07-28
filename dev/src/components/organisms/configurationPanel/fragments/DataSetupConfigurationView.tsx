import React, { FunctionComponent } from "react";
import { InitDataTO } from "../../../../dataAccess/access/to/InitDataTO";
import { DavitUtil } from "../../../../utils/DavitUtil";
import { ActorDropDown, DavitAddButton, DavitDeleteButton, InstanceDropDown } from "../../../atomic";

export interface DataSetupConfigurationViewProps {
    saveInitData: (initData: InitDataTO) => void;
    deleteInitData: (initData: InitDataTO) => void;
    initDatas: InitDataTO[];
    createInitData: () => void;
}

export const DataSetupConfigurationView: FunctionComponent<DataSetupConfigurationViewProps> = (props) => {
    const {saveInitData, deleteInitData, initDatas, createInitData} = props;

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
    );
};
