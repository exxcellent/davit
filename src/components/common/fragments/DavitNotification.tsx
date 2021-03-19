import React, { FunctionComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { DavitIcons } from '../IconSet';

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
                return DavitIcons.info;
            case "warning":
                return DavitIcons.warning;
            case "error":
                return DavitIcons.error;
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
