import React, { FunctionComponent } from "react";
import { StateTO } from "../../../../../../../../../dataAccess/access/to/StateTO";
import { DavitAddButton, DavitButton, DavitDeleteButton, DavitTextInput } from "../../../../../../../../atomic";
import "./StateTable.css";

interface StateTableProps {
    statesToEdit: StateTO[];
    addStateCallback: () => void;
    changeName: (name: string, stateId: number) => void;
    removeStateCallback: (stateId: number) => void;
    setActiveCallback: (state: StateTO, active: boolean) => void;
}

export const StateTable: FunctionComponent<StateTableProps> = (props) => {
    const {statesToEdit, addStateCallback, changeName, removeStateCallback, setActiveCallback} = props;

    const buildStateTableRow = (state: StateTO, index: number): JSX.Element => {

        const inputClasses: string = state.label === "" ? "border border-warning border-animation" : "";

        return (
            <tr className="flex content-space-between fluid"
                key={index}
            >
                <td className={inputClasses}>
                    <DavitTextInput
                        onChangeCallback={(name) => changeName(name, state.id)}
                        placeholder="State Name"
                        value={state.label}
                        focus
                    />
                </td>
                <td className="flex flex-center">

                    <DavitButton
                        className={state.isState ? " active" : ""}
                        onClick={() => setActiveCallback(state, true)}
                    >TRUE</DavitButton>
                    <DavitButton
                        className={state.isState ? "" : " active"}
                        onClick={() => setActiveCallback(state, false)}
                    >FALSE</DavitButton>
                </td>
                <td className="flex flex-center">
                    <DavitDeleteButton onClick={() => removeStateCallback(state.id)}
                                       noConfirm
                    />
                </td>
            </tr>
        );
    };

    return (
        <table className={"border table"}>

            <thead className="flex content-space-between padding-medium">

            <tr className="flex content-space-between fluid">
                <td className="flex flex-center">Name</td>
                <td className="flex flex-center">Default</td>
                <td className={"flex flex-center"}><DavitAddButton onClick={addStateCallback} /></td>
            </tr>

            </thead>

            <tbody className="body">
            {statesToEdit.map((state, index) => buildStateTableRow(state, index))}
            </tbody>

        </table>
    );
};
