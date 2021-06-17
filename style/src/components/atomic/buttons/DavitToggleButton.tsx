import React, { FunctionComponent, useState } from "react";
import "./DavitToggleButton.css";

interface DavitToggleButtonProps {
    toggle: () => void;
    value: boolean;
}

export const DavitToggleButton: FunctionComponent<DavitToggleButtonProps> = (props) => {
    const {toggle, value} = props;

    const [isChecked, setIsChecked] = useState(value);

    const privateToggle = () => {
        toggle();
        setIsChecked(!isChecked);
    };

    return (
        <label className="switch">
            <input type="checkbox"
                   onChange={privateToggle}
                   checked={isChecked}
            />
            <span className="slider round"></span>
        </label>
    );
};
