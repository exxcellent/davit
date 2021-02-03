import React, { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { DropdownProps } from "semantic-ui-react";
import { ActorCTO } from "../../../../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { ActionTO } from "../../../../dataAccess/access/to/ActionTO";
import { ActionType } from "../../../../dataAccess/access/types/ActionType";
import { editSelectors } from "../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";
import { DavitUtil } from "../../../../utils/DavitUtil";
import { DavitDropDownItemProps, DavitIconDropDown } from "./DavitDropDown";

interface ActionDropDownProps extends DropdownProps {
    onSelect: (action: ActionTO | undefined) => void;
    icon?: string;
}

export const ActionButtonDropDown: FunctionComponent<ActionDropDownProps> = (props) => {
    const { onSelect, icon } = props;
    const { actions, actionToOption, selectAction } = useActionDropDownViewModel();

    return (
        <DavitIconDropDown
            dropdownItems={actions.map(actionToOption)}
            onSelect={(item) => onSelect(selectAction(Number(item.value), actions))}
            icon={icon}
        />
    );
};

// TODO: in den master data slice verschieben!
const getActorName = (actorId: number, actors: ActorCTO[]): string => {
    return actors.find((actor) => actor.actor.id === actorId)?.actor.name || "";
};

const getDataName = (dataId: number, datas: DataCTO[]): string => {
    const data: DataCTO | undefined = datas.find((data) => data.data.id === dataId);
    const name: string = data ? data?.data.name : "data is null";
    return name;
};

const getActionTypeLabel = (type: ActionType): string => {
    let label: string = "";
    switch (type) {
        case ActionType.ADD:
            label = "Add or Update";
            break;
        case ActionType.DELETE:
            label = "Delete";
            break;
        case ActionType.SEND:
            label = "Send";
            break;
        case ActionType.SEND_AND_DELETE:
            label = "Send and delete";
            break;
        case ActionType.TRIGGER:
            label = "Trigger";
            break;
    }
    return label;
};

const useActionDropDownViewModel = () => {
    const actions: ActionTO[] = useSelector(editSelectors.selectStepToEdit)?.actions || [];
    const actors: ActorCTO[] = useSelector(masterDataSelectors.selectActors);
    const datas: DataCTO[] = useSelector(masterDataSelectors.selectDatas);

    const actionToOption = (action: ActionTO): DavitDropDownItemProps => {
        return {
            key: action.id,
            value: action.id.toString(),
            text: getOptionText(action),
        };
    };

    const getOptionText = (action: ActionTO): string => {
        let text: string = "";
        if (action.actionType !== ActionType.TRIGGER) {
            text = `${getActorName(action.receivingActorFk, actors)} - ${getActionTypeLabel(
                action.actionType,
            )} - ${getDataName(action.dataFk, datas)}`;
        } else {
            text = `${getActorName(action.sendingActorFk, actors)} - ${getActionTypeLabel(
                action.actionType,
            )} - ${getActorName(action.receivingActorFk, actors)}`;
        }
        return text;
    };

    const selectAction = (actionId: number, actions: ActionTO[]): ActionTO | undefined => {
        if (!DavitUtil.isNullOrUndefined(actionId) && !DavitUtil.isNullOrUndefined(actions)) {
            return actions.find((action) => action.id === actionId);
        }
        return undefined;
    };

    return { actions, actionToOption, selectAction };
};
