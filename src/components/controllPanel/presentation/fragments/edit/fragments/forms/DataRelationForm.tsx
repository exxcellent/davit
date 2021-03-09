import React, { FunctionComponent, useState } from 'react';
import { Form } from '../../../../../../common/fragments/forms/Form';
import { FormLine } from './fragments/FormLine';
import { Dropdown } from 'semantic-ui-react';
import { Direction } from '../../../../../../../dataAccess/access/to/DataRelationTO';
import { DavitCommentButton } from '../../../../../../common/fragments/buttons/DavitCommentButton';
import { DavitButton } from '../../../../../../common/fragments/buttons/DavitButton';
import { DavitBackButton } from '../../../../../../common/fragments/buttons/DavitBackButton';
import { DavitDeleteButton } from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import { useEditDataRelationViewModel } from '../viewmodels/EditDataRelationViewModel';
import { FormLabel, FormlabelAlign } from './fragments/FormLabel';

interface DataRelationFormProps {

}

export const DataRelationForm: FunctionComponent<DataRelationFormProps> = () => {

    const [key, setKey] = useState<number>(0);

    const {
        data1,
        data2,
        direction1,
        direction2,
        setDirection,
        setData,
        saveRelation,
        deleteRelation,
        dataOptions,
        directionOptions,
        createAnother,
        updateRelation,
        note,
        saveNote,
    } = useEditDataRelationViewModel();

    return (
        <Form key={key}>
            <FormLine>
                <h2>Data Relation</h2>
            </FormLine>
            <FormLine>
                <FormLabel align={FormlabelAlign.center}>FROM</FormLabel>
            </FormLine>
            <FormLine>
                <Dropdown
                    placeholder='Select Data...'
                    selection
                    selectOnBlur={false}
                    options={dataOptions}
                    onChange={(event, data) => {
                        setData(Number(data.value));
                    }}
                    value={data1}
                    onBlur={() => updateRelation()}
                />
                <Dropdown
                    placeholder='Select Direction1'
                    selection
                    options={directionOptions}
                    onChange={(event, data) => setDirection(Direction[data.value as Direction])}
                    value={direction1}
                    onBlur={() => updateRelation()}
                />
            </FormLine>
            <FormLine>
                <FormLabel align={FormlabelAlign.center}>TO</FormLabel>
            </FormLine>
            <FormLine>
                <Dropdown
                    placeholder='Select Data...'
                    selection
                    selectOnBlur={false}
                    options={dataOptions}
                    onChange={(event, data) => {
                        setData(Number(data.value), true);
                    }}
                    value={data2}
                    onBlur={() => updateRelation()}
                />
                <Dropdown
                    placeholder='Select Direction2'
                    selection
                    options={directionOptions}
                    onChange={(event, data) => setDirection(Direction[data.value as Direction], true)}
                    value={direction2}
                    onBlur={() => updateRelation()}
                />
            </FormLine>
            <FormLine>
                <DavitCommentButton onSaveCallback={saveNote} comment={note} />
                <DavitButton onClick={() => {
                    createAnother();
                    setKey(key + 1);
                }} label='Create another' />
                <DavitBackButton onClick={saveRelation} />
                <DavitDeleteButton onClick={deleteRelation} />
            </FormLine>
        </Form>
    );
};
