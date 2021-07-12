import React, { FunctionComponent } from "react";
import { StateTO } from "../../../../../../../../../dataAccess/access/to/StateTO";
import { DavitAddButton, DavitDeleteButton, DavitTextInput } from "../../../../../../../../atomic";
import { DavitToggleButton } from "../../../../../../../../atomic/buttons/DavitToggleButton";
import "./StateTable.css";

interface StateTableProps {
    statesToEdit: StateTO[];
    dirty?: number[];
    addStateCallback: () => void;
    changeName: (name: string, stateId: number) => void;
    removeStateCallback: (stateId: number) => void;
    toggleActiveCallback: (state: StateTO) => void;
}

export const StateTable: FunctionComponent<StateTableProps> = (props) => {
    const {statesToEdit, addStateCallback, changeName, removeStateCallback, toggleActiveCallback, dirty} = props;

    const buildStateTableRow = (state: StateTO, index: number): JSX.Element => {

        const inputClasses: string = dirty?.find(id => id === state.id) ? "border border-warning border-animation" : "";

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
                    <DavitToggleButton toggle={() => toggleActiveCallback(state)}
                                       value={state.isState}
                    />
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
                <td className="flex flex-center">Active</td>
                <td className={"flex flex-center"}><DavitAddButton onClick={addStateCallback} /></td>
            </tr>

            </thead>

            <tbody className="body">
            {statesToEdit.map((state, index) => buildStateTableRow(state, index))}
            </tbody>

        </table>
    );
};
