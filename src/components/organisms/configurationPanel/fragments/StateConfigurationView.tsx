import React, { FunctionComponent } from "react";
import { StateTO } from "../../../../dataAccess/access/to/StateTO";
import { StateTable } from "../../controllPanel/presentation/fragments/edit/fragments/forms/fragments/StateTable";

interface StateConfigurationViewProps {
    states: StateTO[];
    setStateCallback: (state: StateTO, active: boolean) => void;
}

export const StateConfigurationView: FunctionComponent<StateConfigurationViewProps> = (props) => {

    const {states, setStateCallback} = props;

    const HEADER: string = "State";

    return (
        <div>

            <StateTable
                statesToEdit={states}
                stateColumnName={HEADER}
                setActiveCallback={setStateCallback}
            />
        </div>
    );
};

