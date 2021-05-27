import React, { FunctionComponent, useState } from "react";
import { DataInstanceTO } from "../../../../../../../dataAccess/access/to/DataInstanceTO";
import { DavitAddButton } from "../../../../../../common/fragments/buttons/DavitAddButton";
import { DavitBackButton } from "../../../../../../common/fragments/buttons/DavitBackButton";
import { DavitButton } from "../../../../../../common/fragments/buttons/DavitButton";
import { DavitCommentButton } from "../../../../../../common/fragments/buttons/DavitCommentButton";
import { DavitDeleteButton } from "../../../../../../common/fragments/buttons/DavitDeleteButton";
import { DavitLabelTextfield } from "../../../../../../common/fragments/DavitLabelTextfield";
import { Form } from "../../../../../../common/fragments/forms/Form";
import { FormBody } from "../../../../../../common/fragments/forms/FormBody";
import { FormFooter } from "../../../../../../common/fragments/forms/FormFooter";
import { FormHeader } from "../../../../../../common/fragments/forms/FormHeader";
import { useDataViewModel } from "../viewmodels/DataViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLine } from "./fragments/FormLine";

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
        } = useDataViewModel();

        const createInstanceRow = (instance: DataInstanceTO, index: number): JSX.Element => {
            return (<tr key={index}>
                    <td>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <DavitLabelTextfield
                                onChangeCallback={(newName) => changeInstanceName(newName, index)}
                                value={instance.name}
                                onBlur={updateData}
                            />
                            {index !== 0 && <DavitDeleteButton onClick={() => deleteInstance(index)}
                                                               noConfirm
                            />}
                        </div>
                    </td>
                </tr>
            );
        };

        return (
            <Form key={key}>

                <FormHeader>
                    <h2>Data</h2>
                </FormHeader>

                <FormDivider />

                <FormBody>


                    <FormLine>
                        <DavitLabelTextfield
                            label="Name:"
                            placeholder="Data Name"
                            onChangeCallback={changeName}
                            value={name}
                            focus
                            onBlur={updateData}
                        />
                    </FormLine>


                    <FormDivider />

                    <FormLine>
                        <table className={"border"}
                               style={{width: "40em"}}
                        >
                            <thead>
                            <tr>
                                <td style={{textAlign: "center"}}>Instances</td>
                                <td style={{textAlign: "end"}}><DavitAddButton onClick={createInstance} /></td>
                            </tr>
                            </thead>
                            <tbody>
                            {instances.map(createInstanceRow)}
                            </tbody>
                        </table>
                    </FormLine>

                </FormBody>

                <FormDivider />

                <FormFooter>
                    <DavitDeleteButton onClick={deleteData} />
                    <DavitCommentButton onSaveCallback={saveNote}
                                        comment={note}
                    />
                    <DavitButton onClick={() => {
                        createAnother();
                        setKey(key + 1);
                    }}
                                 label="Create another"
                    />
                    <DavitBackButton onClick={saveData} />
                </FormFooter>


            </Form>
        );
    }
;
