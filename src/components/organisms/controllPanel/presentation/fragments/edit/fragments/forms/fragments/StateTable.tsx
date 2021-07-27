import React, { FunctionComponent } from "react";
import { StateTO } from "../../../../../../../../../dataAccess/access/to/StateTO";
import { DavitAddButton, DavitDeleteButton, DavitTextInput } from "../../../../../../../../atomic";
import { ToggleButton } from "../../../../../../../../molecules/ToggleButton";
import "./StateTable.css";

interface StateTableProps {
    statesToEdit: StateTO[];
    stateColumnName: string
    setActiveCallback: (state: StateTO, active: boolean) => void;
    changeName?: (name: string, stateId: number) => void;
    removeStateCallback?: (stateId: number) => void;
    addStateCallback?: () => void;
}

export const StateTable: FunctionComponent<StateTableProps> = (props) => {
    const {statesToEdit, addStateCallback, changeName, removeStateCallback, setActiveCallback, stateColumnName} = props;

    const trueLabel: string = "TRUE";
    const falseLabel: string = "FALSE";

    const buildStateTableRow = (state: StateTO, index: number): JSX.Element => {

        const inputClasses: string = state.label === "" ? "border border-warning border-animation" : "";

        return (
            <tr className="flex content-space-between fluid"
                key={index}
            >
                <td className={inputClasses}>
                    {changeName && <DavitTextInput
                        onChangeCallback={(name) => changeName(name, state.id)}
                        placeholder="State Name"
                        value={state.label}
                        focus
                    />}
                    {!changeName && <div className="flex align-center width-fluid height-fluid padding-left-m"><label>{state.label}</label> </div>}
                </td>
                <td className="flex flex-center">

                    <ToggleButton toggleCallback={(is) => setActiveCallback(state, is)}
                                  isLeft={state.isState}
                                  leftLabel={trueLabel}
                                  rightLabel={falseLabel}
                    />

                </td>
                {removeStateCallback && <td className="flex flex-center">
                    <DavitDeleteButton onClick={() => removeStateCallback(state.id)}
                                       noConfirm
                    />
                </td>}
            </tr>
        );
    };

    return (
        <table className={"border table"}>

            <thead className="flex content-space-between padding-medium">

            <tr className="flex content-space-between fluid">
                <td className="flex flex-center">Name</td>
                <td className="flex flex-center">{stateColumnName}</td>
                {addStateCallback && <td className={"flex flex-center"}><DavitAddButton onClick={addStateCallback} /></td>}
            </tr>

            </thead>

            <tbody className="body">
            {statesToEdit.map((state, index) => buildStateTableRow(state, index))}
            </tbody>

        </table>
    );
};
