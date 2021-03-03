import React, { FunctionComponent, useState } from 'react';
import { DavitLabelTextfield } from '../../../../../../common/fragments/DavitLabelTextfield';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitButton } from '../../../../../../common/fragments/buttons/DavitButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { useEditDataViewModel } from '../viewmodels/EditDataViewModel';
import { DataInstanceTO } from '../../../../../../../dataAccess/access/to/DataInstanceTO';

interface DataFormProps {
}

export const DataForm: FunctionComponent<DataFormProps> = () => {

        const [key, setKey] = useState<number>(0);

        const {
            name,
            changeName,
            saveData,
            deleteData,
            updateData,
            createAnother,
            instances,
            // editOrAddInstance,
            note,
            saveNote,
        } = useEditDataViewModel();

        const createInstanceRow = (instance: DataInstanceTO): JSX.Element => {
                return (<tr key={instance.id}>
                        <td>{instance.name}</td>
                    </tr>
                );
        };

        return (
            <div className={'form'} key={key}>
                <DavitLabelTextfield
                    label='Name:'
                    placeholder='Data Name'
                    onChangeDebounced={changeName}
                    value={name}
                    focus={true}
                    onBlur={updateData}
                />

                {/*<AddOrEdit addCallBack={() => editOrAddInstance()} label={'Instance'}*/}
                {/*           dropDown={<DataInstanceDropDownButton*/}
                {/*               onSelect={(id) => editOrAddInstance(id)}*/}
                {/*               icon={'wrench'}*/}
                {/*               instances={instances}*/}
                {/*           />}/>*/}

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    paddingTop: 'var(--davit-padding-top-bottom)',
                }}>
                    <DavitDeleteButton onClick={deleteData} />
                    <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                    <DavitButton onClick={() => {
                        createAnother();
                        setKey(key + 1);
                    }} label='Create another' />
                    <DavitBackButton onClick={saveData} />
                </div>

                <div style={{width: "20em", paddingTop: "var(--davit-padding-top-bottom)"}}>
                <table>
                    <thead>
                    <tr>
                        <td>Instances</td>
                    </tr>
                    </thead>
                    <tbody>
                    {instances.map(createInstanceRow)}
                    </tbody>
                </table>
                </div>
            </div>
        );
    }
;
