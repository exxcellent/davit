import React, { FunctionComponent, useState } from "react";
import { Dropdown } from "semantic-ui-react";
import { Direction } from "../../../../../../../dataAccess/access/to/DataRelationTO";
import { DavitBackButton } from "../../../../../../common/fragments/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../common/fragments/buttons/DavitButton";
import { DavitCommentButton } from "../../../../../../common/fragments/buttons/DavitCommentButton";
import { DavitDeleteButton } from "../../../../../../common/fragments/buttons/DavitDeleteButton";
import { Form } from "../../../../../../common/fragments/forms/Form";
import { FormBody } from "../../../../../../common/fragments/forms/FormBody";
import { FormFooter } from "../../../../../../common/fragments/forms/FormFooter";
import { FormHeader } from "../../../../../../common/fragments/forms/FormHeader";
import { useDataRelationViewModel } from "../viewmodels/DataRelationViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLabel, FormlabelAlign } from "./fragments/FormLabel";
import { FormLine } from "./fragments/FormLine";

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

            <FormDivider />

            <FormBody>


                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>FROM</FormLabel>
                </FormLine>

                <FormLine>
                    <Dropdown
                        placeholder="Select Data..."
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
                        placeholder="Select Direction1"
                        selection
                        options={directionOptions}
                        onChange={(event, data) => setDirection(Direction[data.value as Direction])}
                        value={direction1}
                        onBlur={() => updateRelation()}
                    />
                </FormLine>

                <FormDivider />

                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>TO</FormLabel>
                </FormLine>
                <FormLine>
                    <Dropdown
                        placeholder="Select Data..."
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
                        placeholder="Select Direction2"
                        selection
                        options={directionOptions}
                        onChange={(event, data) => setDirection(Direction[data.value as Direction], true)}
                        value={direction2}
                        onBlur={() => updateRelation()}
                    />
                </FormLine>

            </FormBody>

            <FormDivider />

            <FormFooter>
                <DavitDeleteButton onClick={deleteRelation} />
                <DavitCommentButton onSaveCallback={saveNote}
                                    comment={note}
                />
                <DavitButton onClick={() => {
                    createAnother();
                    setKey(key + 1);
                }}
                             label="Create another"
                />
                <DavitBackButton onClick={saveRelation} />
            </FormFooter>

        </Form>
    );
};
