import React, {FunctionComponent, useState} from 'react';
import {DavitLabelTextfield} from '../../../../../../common/fragments/DavitLabelTextfield';
import {DavitDeleteButton} from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import {useEditDataViewModel} from '../viewmodels/EditDataViewModel';
import {DataInstanceTO} from '../../../../../../../dataAccess/access/to/DataInstanceTO';
import {DavitCommentButton} from "../../../../../../common/fragments/buttons/DavitCommentButton";
import {DavitButton} from "../../../../../../common/fragments/buttons/DavitButton";
import {DavitBackButton} from "../../../../../../common/fragments/buttons/DavitBackButton";
import {DavitAddButton} from "../../../../../../common/fragments/buttons/DavitAddButton";
import {Form} from "../../../../../../common/fragments/forms/Form";
import {FormLine} from "./FormLine";

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
            note,
            saveNote,
            changeInstanceName,
            createInstance,
            deleteInstance
        } = useEditDataViewModel();

        const createInstanceRow = (instance: DataInstanceTO, index: number): JSX.Element => {
            return (<tr key={index}>
                    <td>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <DavitLabelTextfield
                                onChangeCallback={(newName) => changeInstanceName(newName, index)}
                                value={instance.name}
                                onBlur={updateData}
                            />
                            {index !== 0 && <DavitDeleteButton onClick={() => deleteInstance(index)} noConfirm/>}
                        </div>
                    </td>
                </tr>
            );
        };

        return (
            <Form key={key}>
                <FormLine>

                    <DavitLabelTextfield
                        label='Name:'
                        placeholder='Data Name'
                        onChangeCallback={changeName}
                        value={name}
                        focus
                        onBlur={updateData}
                    />
                </FormLine>

                <FormLine>

                    <DavitDeleteButton onClick={deleteData}/>
                    <DavitCommentButton onSaveCallback={saveNote} comment={note}/>
                    <DavitButton onClick={() => {
                        createAnother();
                        setKey(key + 1);
                    }} label='Create another'/>
                    <DavitBackButton onClick={saveData}/>
                </FormLine>

                <FormLine>
                    <table className={"border"}>
                        <thead>
                        <tr>
                            <td style={{textAlign: "center"}}>Instances</td>
                            <td style={{textAlign: "end"}}><DavitAddButton onClick={createInstance}/></td>
                        </tr>
                        </thead>
                        <tbody>
                        {instances.map(createInstanceRow)}
                        </tbody>
                    </table>
                </FormLine>

            </Form>
        );
    }
;
