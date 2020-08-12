import React, { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Dropdown, DropdownItemProps, DropdownProps } from "semantic-ui-react";
import { isNullOrUndefined } from "util";
import { ComponentCTO } from "../../../../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../../../../dataAccess/access/cto/DataCTO";
import { ActionTO } from "../../../../dataAccess/access/to/ActionTO";
import { getDataAndInstanceIds } from "../../../../dataAccess/access/to/DataTO";
import { editSelectors } from "../../../../slices/EditSlice";
import { masterDataSelectors } from "../../../../slices/MasterDataSlice";

interface ActionDropDownProps extends DropdownProps {
  onSelect: (action: ActionTO | undefined) => void;
  icon?: string;
}

export const ActionDropDown: FunctionComponent<ActionDropDownProps> = (props) => {
  const { onSelect, icon } = props;
  const { actions, actionToOption, selectAction, isEmpty } = useActionDropDownViewModel();

  return (
    <Dropdown
      options={actions.map(actionToOption).sort((a, b) => {
        return a.text! < b.text! ? -1 : a.text! > b.text! ? 1 : 0;
      })}
      selectOnBlur={false}
      onChange={(event, data) => onSelect(selectAction(Number(data.value), actions))}
      scrolling
      floating
      compact
      className="button icon"
      icon={isEmpty ? "" : icon}
      trigger={<React.Fragment />}
      disabled={isEmpty}
    />
  );
};

// TODO: in den master data slice verschieben!
const getComponentName = (compId: number, components: ComponentCTO[]): string => {
  return components.find((comp) => comp.component.id === compId)?.component.name || "";
};

const getDataName = (dataId: number, datas: DataCTO[]): string => {
  const ids = getDataAndInstanceIds(dataId);
  const data: DataCTO | undefined = datas.find((data) => data.data.id === ids.dataId);
  const instance = ids.instanceId ? data?.data.inst.find((instance) => instance.id === ids.instanceId) : undefined;
  const name: string = data?.data.name + " " + (instance?.name || "");
  return name;
};

const useActionDropDownViewModel = () => {
  const actions: ActionTO[] = useSelector(editSelectors.stepToEdit)?.actions || [];
  const components: ComponentCTO[] = useSelector(masterDataSelectors.components);
  const datas: DataCTO[] = useSelector(masterDataSelectors.datas);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);

  useEffect(() => {
    actions.length > 0 ? setIsEmpty(false) : setIsEmpty(true);
  }, [actions]);

  const actionToOption = (action: ActionTO): DropdownItemProps => {
    const text: string = `${getComponentName(action.componentFk, components)} - ${action.actionType} - ${getDataName(
      action.dataFk,
      datas
    )}`;
    return {
      key: action.id,
      value: action.id,
      text: text,
    };
  };

  const selectAction = (actionId: number, actions: ActionTO[]): ActionTO | undefined => {
    if (!isNullOrUndefined(actionId) && !isNullOrUndefined(actions)) {
      return actions.find((action) => action.id === actionId);
    }
    return undefined;
  };

  return { actions, actionToOption, selectAction, isEmpty };
};
