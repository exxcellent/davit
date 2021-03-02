import {faTrashAlt} from "@fortawesome/free-solid-svg-icons/faTrashAlt";
import React, {FunctionComponent, useEffect, useState} from "react";
import {DavitButton} from "./DavitButton";

interface DavitDeleteButtonProps {
    onClick: () => void;
    disable?: boolean;
}

export const DavitDeleteButton: FunctionComponent<DavitDeleteButtonProps> = (props) => {
    const {onClick, disable} = props;

    const SHRINK_DELAY: number = 3000;

    const [fluid, setFluid] = useState<boolean>(false);

    // TODO: BUG JIRA => CARV2-227
    useEffect(() => {
        if (fluid) setTimeout(() => setFluid(false), SHRINK_DELAY);
    }, [fluid]);

    return (
        <DavitButton
            iconName={fluid ? undefined : faTrashAlt}
            onClick={() => (fluid ? onClick() : setFluid(true))}
            className={fluid ? "deleteButton fluid" : "deleteButton"}
            disable={disable}
            label={fluid ? "SURE" : undefined}
        />
    );
};