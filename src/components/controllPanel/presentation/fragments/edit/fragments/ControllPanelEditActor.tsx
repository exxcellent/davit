import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'semantic-ui-react';
import { isNullOrUndefined } from 'util';
import { ActorCTO } from '../../../../../../dataAccess/access/cto/ActorCTO';
import { GroupTO } from '../../../../../../dataAccess/access/to/GroupTO';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { DavitUtil } from '../../../../../../utils/DavitUtil';
import { Carv2DeleteButton } from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import { DavitButtonIcon, DavitButtonLabel } from '../../../../../common/fragments/buttons/DavitButton';
import { ControllPanelEditSub } from '../common/ControllPanelEditSub';
import { Carv2LabelTextfield } from '../common/fragments/Carv2LabelTextfield';
import { OptionField } from '../common/OptionField';

export interface ControllPanelEditComponentProps {
    hidden: boolean;
}

export const ControllPanelEditComponent: FunctionComponent<ControllPanelEditComponentProps> = (props) => {
    const { hidden } = props;
    const {
        label,
        name,
        changeName,
        saveComponent,
        deleteComponent,
        textInput,
        updateComponent,
        createAnother,
        id,
    } = useControllPanelEditComponentViewModel();

    return (
        <ControllPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveComponent}>
            <div className="optionFieldSpacer">
                <OptionField label="Component - Name">
                    <Carv2LabelTextfield
                        label="Name:"
                        placeholder="Component Name"
                        onChange={(event: any) => changeName(event.target.value)}
                        onBlur={() => updateComponent()}
                        value={name}
                        autoFocus
                        ref={textInput}
                        unvisible={hidden}
                    />
                </OptionField>
            </div>
            <div className="columnDivider">
                <OptionField></OptionField>
            </div>
            <div className="columnDivider controllPanelEditChild">
                <div>
                    <OptionField label="Navigation">
                        <DavitButtonLabel onClick={createAnother} label="Create another" />
                        <DavitButtonIcon onClick={saveComponent} icon="reply" />
                    </OptionField>
                </div>
            </div>
            <div className="optionFieldSpacer columnDivider">
                <OptionField label="Component - Options">
                    <Carv2DeleteButton onClick={deleteComponent} />
                </OptionField>
            </div>
        </ControllPanelEditSub>
    );
};

const useControllPanelEditComponentViewModel = () => {
    const componentToEdit: ActorCTO | null = useSelector(editSelectors.actorToEdit);
    const dispatch = useDispatch();
    const textInput = useRef<Input>(null);

    useEffect(() => {
        // check if component to edit is really set or gos back to edit mode
        if (isNullOrUndefined(componentToEdit)) {
            handleError('Tried to go to edit component without componentToedit specified');
            EditActions.setMode.edit();
        }
        // used to focus the textfield on create another
        textInput.current!.focus();
    }, [componentToEdit]);

    const changeName = (name: string) => {
        const copyComponentToEdit: ActorCTO = DavitUtil.deepCopy(componentToEdit);
        copyComponentToEdit.actor.name = name;
        dispatch(EditActions.setMode.editActor(copyComponentToEdit));
    };

    const updateComponent = () => {
        const copyComponentToEdit: ActorCTO = DavitUtil.deepCopy(componentToEdit);
        dispatch(EditActions.actor.save(copyComponentToEdit));
    };

    const saveComponent = (newMode?: string) => {
        if (!isNullOrUndefined(componentToEdit)) {
            if (componentToEdit?.actor.name !== '') {
                dispatch(EditActions.actor.save(componentToEdit!));
            } else {
                deleteComponent();
            }
            dispatch(EditActions.setMode.edit());
        }
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editActor());
    };

    const deleteComponent = () => {
        dispatch(EditActions.actor.delete(componentToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const setGroup = (group: GroupTO | undefined) => {
        if (!isNullOrUndefined(componentToEdit)) {
            const copyComponentToEdit: ActorCTO = DavitUtil.deepCopy(componentToEdit);
            if (group !== undefined) {
                copyComponentToEdit.actor.groupFks = group.id;
            } else {
                copyComponentToEdit.actor.groupFks = -1;
            }
            dispatch(EditActions.setMode.editActor(copyComponentToEdit));
        }
    };

    return {
        label: 'EDIT * ' + (componentToEdit?.actor.name || ''),
        name: componentToEdit?.actor.name,
        changeName,
        saveComponent,
        deleteComponent,
        textInput,
        setGroup,
        compGroup: componentToEdit?.actor.groupFks !== -1 ? componentToEdit?.actor.groupFks : undefined,
        updateComponent,
        createAnother,
        id: componentToEdit?.actor.id || -1,
    };
};
