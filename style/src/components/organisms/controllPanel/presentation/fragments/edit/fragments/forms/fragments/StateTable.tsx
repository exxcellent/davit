import React, { FunctionComponent } from "react";
import { StateTO } from "../../../../../../../../../dataAccess/access/to/StateTO";
import { DavitDeleteButton, DavitTextInput } from "../../../../../../../../atomic";
import { DavitToggleButton } from "../../../../../../../../atomic/buttons/DavitToggleButton";
import "./StateTable.css";

interface StateTableProps {
    statesToEdit: StateTO[];
    removeStateCallback: (stateId: number) => void;
    toggleActiveCallback: (stateId: number) => void;
}

export const StateTable: FunctionComponent<StateTableProps> = (props) => {
    const {statesToEdit, removeStateCallback, toggleActiveCallback} = props;

    // TODO: hiiiier gehts weiter....
    const buildStateTableRow = (state: StateTO): JSX.Element => {
        return (
            <tr className="flex content-space-between"
                key={state.id}
            >
                <td className="flex flex-center">
                    <DavitTextInput onChangeCallback={(e) => state.label = state.label + e}
                                    value={state.label}
                    />
                </td>
                {/*<td>{state.isState}</td>*/}
                <td className="flex flex-center">
                    <DavitToggleButton toggle={() => toggleActiveCallback(state.id)}
                                       value={state.isState}
                    />
                </td>
                <td className="flex flex-center"><DavitDeleteButton onClick={() => removeStateCallback(state.id)} />
                </td>
            </tr>
        );
    };

    // const buildChainTableRow = (state: ChainStateTO): JSX.Element => {
    //     return (
    //         <tr className="flex content-space-between"
    //             key={state.id}
    //         >
    //             <td className="flex flex-center">
    //                 <DavitTextInput onChangeCallback={(e) => state.label = state.label + e}
    //                                 value={state.label}
    //                 />
    //             </td>
    //             {/*<td>{state.isState}</td>*/}
    //             <td className="flex flex-center"><DavitToggleButton toggle={() => toggleActiveCallback(state.id)}
    //                                                                 value={state.isState}
    //             /></td>
    //             <td className="flex flex-center"><DavitDeleteButton onClick={() => removeStateCallback(state.id)} />
    //             </td>
    //         </tr>
    //     );
    // };

    return (
        <table className={"border table"}>

            <thead className="flex content-space-between padding-medium">

            <tr className="flex content-space-between">
                <td className="flex flex-center">Name</td>
                <td className="flex flex-center">Active</td>
                <td className={"flex flex-center"}>Options</td>
            </tr>

            </thead>

            <tbody className="body">

            {statesToEdit
                //TODO: remove this after implementing!
                // .map((state: SequenceStateTO | ChainStateTO, index: number) => {
                //     state.id = index;
                //     return state;
                // })
                .map(buildStateTableRow)}

            </tbody>

        </table>
    );
};
