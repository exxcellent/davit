import { faReply } from "@fortawesome/free-solid-svg-icons";
import React, { FunctionComponent } from "react";
import { ActionType } from "../../../../../../../dataAccess/access/types/ActionType";
import { DavitButton } from "../../../../../../common/fragments/buttons/DavitButton";
import { DavitDeleteButton } from "../../../../../../common/fragments/buttons/DavitDeleteButton";
import { DavitLabelTextfield } from "../../../../../../common/fragments/DavitLabelTextfield";
import { ActionTypeDropDown } from "../../../../../../common/fragments/dropdowns/ActionTypeDropDown";
import { ActorDropDown } from "../../../../../../common/fragments/dropdowns/ActorDropDown";
import { DataDropDown } from "../../../../../../common/fragments/dropdowns/DataDropDown";
import { InstanceDropDown } from "../../../../../../common/fragments/dropdowns/InstanceDropDown";
import { Form } from "../../../../../../common/fragments/forms/Form";
import { useActionViewModel } from "../viewmodels/ActionViewModel";
import { FormDivider } from "./fragments/FormDivider";
import { FormLabel, FormlabelAlign } from "./fragments/FormLabel";
import { FormLine } from "./fragments/FormLine";

interface ActionFormProps {

}

export const ActionForm: FunctionComponent<ActionFormProps> = () => {

    const {
        setActor,
        setAction,
        setData,
        deleteActionToEdit,
        sendingActorId,
        receivingActorId,
        dataId,
        actionType,
        setMode,
        createAnother,
        setDataAndInstance,
        dataAndInstance,
        setTriggerLabel,
        triggerLabel,
    } = useActionViewModel();

    return <Form>

        <FormLine>
            <h2>Action</h2>
        </FormLine>

        <FormLine>
            <FormLabel>Select Action</FormLabel>
            <ActionTypeDropDown onSelect={setAction}
                                value={actionType}
            />
        </FormLine>

        <FormDivider />

        {actionType !== ActionType.TRIGGER && <FormLine>

            {actionType === ActionType.ADD && (
                <>
                    <FormLabel>Select Data Instance</FormLabel>
                    <InstanceDropDown onSelect={setDataAndInstance}
                                      value={dataAndInstance}
                    />
                </>
            )}
            {actionType !== ActionType.ADD &&
            <>
                <FormLabel>Select Data</FormLabel>
                <DataDropDown onSelect={setData}
                              value={dataId}
                />
            </>}
        </FormLine>}

        {actionType === ActionType.TRIGGER &&
        <FormLine>
            <FormLabel>Enter Trigger text</FormLabel>
            <DavitLabelTextfield
                placeholder="Trigger text ..."
                onChangeCallback={(name: string) => setTriggerLabel(name)}
                value={triggerLabel}
            />
        </FormLine>}

        <FormLine>
            <FormLabel align={FormlabelAlign.center}>
                {actionType === ActionType.ADD ? "TO" : "FROM"}
            </FormLabel>
        </FormLine>

        <FormLine>
            <FormLabel>
                {
                    actionType?.includes("SEND") || actionType === ActionType.TRIGGER
                        ? "Select sending Actor"
                        : "Actor"
                }
            </FormLabel>
            <ActorDropDown
                onSelect={(actor) =>
                    setActor(actor, actionType?.includes("SEND") || actionType === ActionType.TRIGGER)
                }
                value={
                    actionType?.includes("SEND") || actionType === ActionType.TRIGGER
                        ? sendingActorId
                        : receivingActorId
                }
            />
        </FormLine>

        {
            (actionType?.includes("SEND") || actionType === ActionType.TRIGGER) &&
            <>
                <FormLine>
                    <FormLabel align={FormlabelAlign.center}>
                        TO
                    </FormLabel>
                </FormLine>
                <FormLine>
                    <FormLabel>Select receiving Actor</FormLabel>
                    <ActorDropDown
                        onSelect={(actor) => setActor(actor, false)}
                        value={receivingActorId}
                    />
                </FormLine>
            </>
        }

        <FormDivider />

        <FormLine>
            <DavitDeleteButton onClick={deleteActionToEdit} />
            <DavitButton onClick={createAnother}
                         label="Create another"
            />
            <DavitButton onClick={setMode}
                         iconName={faReply}
            />
        </FormLine>
    </Form>;
};
