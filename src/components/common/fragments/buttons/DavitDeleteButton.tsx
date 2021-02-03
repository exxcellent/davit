import React, { FunctionComponent, useState } from "react";
import { Button } from "semantic-ui-react";

interface DavitDeleteButtonProps {
    onClick: () => void;
    disable?: boolean;
}

export const DavitDeleteButton: FunctionComponent<DavitDeleteButtonProps> = (props) => {
    const { onClick, disable } = props;

    const [fluid, setFluid] = useState<boolean>(false);

    const onButtonClick = () => {
        setFluid(true);
    };

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
                    onClick={onButtonClick}
                    className="carv2Button"
                    inverted
                    color="red"
                    disabled={disable}
                />
            )}
            {fluid && (
                <Button onClick={onClick} className="carv2Button" inverted color="red" fluid>
                    SURE?
                </Button>
            )}
        </div>
    );
};
