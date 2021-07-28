import React, { FunctionComponent } from "react";
import { StateTO } from "../../../../../../../../../dataAccess/access/to/StateTO";
import { DavitAddButton, DavitDeleteButton, DavitTextInput } from "../../../../../../../../atomic";
import { Table, TableRow } from "../../../../../../../../atomic/Table";
import { ToggleButton } from "../../../../../../../../molecules/ToggleButton";

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

    const buildTableRow = (state: StateTO, index: number): TableRow => {

        const getLabel = (): JSX.Element => {
            return changeName
                ?
                <div className="flex flex-center align-center">
                    <DavitTextInput
                        key={index}
                        onChangeCallback={(name) => changeName ? changeName(name, state.id) : {}}
                        placeholder="State Name"
                        value={state.label}
                        focus
                    />
                </div>
                : <div className="flex align-center width-fluid height-fluid padding-left-m"
                       key={index}
                >
                    <label>{state.label}</label></div>;
        };

        const getToggleButton = (): JSX.Element => {
            return (<ToggleButton
                key={index}
                toggleCallback={(is) => setActiveCallback(state, is)}
                isLeft={state.isState}
                leftLabel={trueLabel}
                rightLabel={falseLabel}
            />);
        };

        const getDeleteButton = (): JSX.Element => {
            return removeStateCallback
                ? <DavitDeleteButton onClick={() => removeStateCallback(state.id)}
                                     noConfirm
                />
                : <div />;
        };

        return {
            cellElements: [getLabel(), getToggleButton(), getDeleteButton()]
        };
    };

    const getHeaders = (): JSX.Element[] => {
        return addStateCallback
            ? [<label key={1}>Name</label>, <label key={2}>{stateColumnName}</label>, <DavitAddButton key={3}
                                                                                                      onClick={addStateCallback}
            />]
            : [<label key={1}>Name</label>, <label key={2}>{stateColumnName}</label>];
    };

    const getRows = (): TableRow[] => {
        return statesToEdit.map(buildTableRow);
    };

    return (
        <Table headers={getHeaders()}
               tableRows={getRows()}
        />
    );
};
