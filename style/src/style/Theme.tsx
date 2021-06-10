import React, { FunctionComponent } from "react";

interface ThemeProps {
}

export const Theme: FunctionComponent<ThemeProps> = (props) => {
    const {children} = props;

    return (
        <div className="dark">
            {children}
        </div>
    );
};
