import React, { FunctionComponent } from 'react';
import { Form } from '../../../../../../common/fragments/forms/Form';
import { FormLine } from './fragments/FormLine';
import { DavitLabelTextfield } from '../../../../../../common/fragments/DavitLabelTextfield';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitButton } from '../../../../../../common/fragments/buttons/DavitButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { useEditDataSetupViewModel } from '../viewmodels/EditDataSetupViewModel';
import { DavitAddButton } from '../../../../../../common/fragments/buttons/DavitAddButton';
import { ActorDropDown } from '../../../../../../common/fragments/dropdowns/ActorDropDown';
import { InstanceDropDown } from '../../../../../../common/fragments/dropdowns/InstanceDropDown';
import { InitDataTO } from '../../../../../../../dataAccess/access/to/InitDataTO';
import { DavitUtil } from '../../../../../../../utils/DavitUtil';

interface DataSetupFormProps {

}

export const DataSetupForm: FunctionComponent<DataSetupFormProps> = () => {

    const {
        name,
        changeName,
        saveDataSetup,
        deleteDataSetup,
        createAnother,
        updateDataSetup,
        createInitData,
        note,
        saveNote,
        initDatas,
        saveInitData,
        deleteInitData,
    } = useEditDataSetupViewModel();

    const buildActorDataTableRow = (initData: InitDataTO): JSX.Element => {
        let copyInitData: InitDataTO = DavitUtil.deepCopy(initData);

        return (<tr key={copyInitData.id}>
                <td>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                            } />
                        {copyInitData.id !== -1 && <DavitDeleteButton onClick={() => {
                            deleteInitData(copyInitData);
                        }} noConfirm />}
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <Form>
            <FormLine>
                <h2>Data Setup</h2>
            </FormLine>
            <FormLine>
                <DavitLabelTextfield
                    label='Name:'
                    placeholder='Data Setup Name ...'
                    onChangeCallback={(name: string) => changeName(name)}
                    value={name}
                    focus={true}
                    onBlur={updateDataSetup}
                />
            </FormLine>

            <FormLine>
                <DavitDeleteButton onClick={deleteDataSetup} />
                <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                <DavitButton onClick={createAnother} label='Create another' />
                <DavitBackButton onClick={saveDataSetup} />
            </FormLine>

            <FormLine>
                <table className={'border'} style={{ width: '40em', minHeight: '40em' }}>
                    <thead>
                    <tr>
                        <td style={{ textAlign: 'center' }}>Actor</td>
                        <td style={{ textAlign: 'center' }}>Data Instance</td>
                        <td style={{ textAlign: 'end' }}><DavitAddButton onClick={createInitData} /></td>
                    </tr>
                    </thead>
                    <tbody>
                    {initDatas.map(buildActorDataTableRow)}
                    </tbody>
                </table>
            </FormLine>

        </Form>
    );
};
