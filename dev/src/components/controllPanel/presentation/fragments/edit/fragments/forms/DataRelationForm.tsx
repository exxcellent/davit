import React, {FunctionComponent, useState} from 'react';
import {Form} from '../../../../../../common/fragments/forms/Form';
import {FormLine} from './fragments/FormLine';
import {Direction} from '../../../../../../../dataAccess/access/to/DataRelationTO';
import {DavitCommentButton} from '../../../../../../common/fragments/buttons/DavitCommentButton';
import {DavitButton} from '../../../../../../common/fragments/buttons/DavitButton';
import {DavitBackButton} from '../../../../../../common/fragments/buttons/DavitBackButton';
import {DavitDeleteButton} from '../../../../../../common/fragments/buttons/DavitDeleteButton';
import {useDataRelationViewModel} from '../viewmodels/DataRelationViewModel';
import {FormLabel, FormlabelAlign} from './fragments/FormLabel';
import {FormDivider} from './fragments/FormDivider';
import {FormHeader} from '../../../../../../common/fragments/forms/FormHeader';
import {FormBody} from '../../../../../../common/fragments/forms/FormBody';
import {FormFooter} from '../../../../../../common/fragments/forms/FormFooter';
import {DavitDropDown} from "../../../../../../common/fragments/dropdowns/DavitDropDown";

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
    } = useDataRelationViewModel();

    return (
        <Form key={key}>
            <FormHeader>
                <h2>Data Relation</h2>
            </FormHeader>

            <FormDivider/>

            <FormBody>

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>FROM</FormLabel>
                </FormLine>

                <FormLine>
                    <DavitDropDown
                        placeholder='Select Data...'
                        dropdownItems={dataOptions}
                        onSelect={(data) => {
                            setData(Number(data.value));
                            updateRelation();
                        }}
                        value={data1}
                    />
                    <DavitDropDown
                        placeholder='Select Direction1'
                        dropdownItems={directionOptions}
                        onSelect={(data) => {
                            setDirection(Direction[data.value as Direction]);
                            updateRelation();
                        }}
                        value={direction1}
                    />
                </FormLine>

                <FormDivider/>

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>TO</FormLabel>
                </FormLine>
                <FormLine>
                    <DavitDropDown
                        placeholder='Select Data...'
                        dropdownItems={dataOptions}
                        onSelect={(data) => {
                            setData(Number(data.value), true);
                            updateRelation();
                        }}
                        value={data2}
                    />
                    <DavitDropDown
                        placeholder='Select Direction2'
                        dropdownItems={directionOptions}
                        onSelect={(data) => {
                            setDirection(Direction[data.value as Direction], true);
                            updateRelation();
                        }}
                        value={direction2}
                    />
                </FormLine>

            </FormBody>

            <FormDivider/>

            <FormFooter>
                <DavitDeleteButton onClick={deleteRelation}/>
                <DavitCommentButton onSaveCallback={saveNote} comment={note}/>
                <DavitButton onClick={() => {
                    createAnother();
                    setKey(key + 1);
                }} label='Create another'/>
                <DavitBackButton onClick={saveRelation}/>
            </FormFooter>

        </Form>
    );
};
