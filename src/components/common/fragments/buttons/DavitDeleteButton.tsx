import React, { FunctionComponent, useEffect, useState } from "react";
import { Button } from "semantic-ui-react";

interface DavitDeleteButtonProps {
    onClick: () => void;
    disable?: boolean;
}

export const DavitDeleteButton: FunctionComponent<DavitDeleteButtonProps> = (props) => {
    const { onClick, disable } = props;

    const SHRINK_DELAY: number = 3000;

    const [fluid, setFluid] = useState<boolean>(false);

    // TODO: BUG JIRA => CARV2-227
    useEffect(() => {
        if (fluid) setTimeout(() => setFluid(false), SHRINK_DELAY);
    }, [fluid]);

    return (
        <div
            style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
            }}>
            {!fluid && (
                <Button
                    icon={disable ? "" : "trash alternate"}
                    onClick={() => setFluid(true)}
                    className="carv2Button"
                    inverted
                    color="red"
                    disabled={disable}
                />
            )}
            {fluid && (
                <Button onClick={onClick} className="deleteButton" inverted color="red" fluid>
                    SURE?
                </Button>
            )}
        </div>
    );
};
