import React, {FunctionComponent} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle, faMinusCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";

export enum NotificationLevel {
    info = "info",
    warning = "warning",
    error = "error"
}

export interface DavitNotificationProps {
    header: string;
    text: string;
    level: NotificationLevel;
    onCloseCallback: () => void;
}

export const DavitNotification: FunctionComponent<DavitNotificationProps> = (props) => {
    const {header, text, level, onCloseCallback} = props;

    const getNotificationIcon = (): IconDefinition => {
        switch (level) {
            case "info":
                return faInfoCircle;
            case "warning":
                return faTimesCircle;
            case "error":
                return faMinusCircle;
            default:
                return faInfoCircle;
        }
    };

    const getIconColor = (): string => {
        switch (level) {
            case "info":
                return "white";
            case "warning":
                return "orange";
            case "error":
                return "var(--carv2-data-delete-color)";
            default:
                return "white";
        }
    };

    return (
        <div className={"notificationCard"} style={{borderColor: getIconColor()}}>
            <button style={{borderColor: getIconColor(), paddingLeft: "0.5em", paddingRight: "0.5em", margin: "1em"}}
                    onClick={() => onCloseCallback()}>
                <FontAwesomeIcon icon={getNotificationIcon()} size={"2x"} style={{color: getIconColor()}}/>
            </button>
            <div>
                <h3 style={{color: getIconColor()}}>{header}</h3>
                <label style={{color: "var(--carv2-text-color)"}}>{text}</label>
            </div>
        </div>
    );
};
