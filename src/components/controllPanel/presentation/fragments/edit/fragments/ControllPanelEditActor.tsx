import React, { FunctionComponent, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from 'semantic-ui-react';
import { ActorCTO } from '../../../../../../dataAccess/access/cto/ActorCTO';
import { GroupTO } from '../../../../../../dataAccess/access/to/GroupTO';
import { EditActions, editSelectors } from '../../../../../../slices/EditSlice';
import { handleError } from '../../../../../../slices/GlobalSlice';
import { DavitUtil } from '../../../../../../utils/DavitUtil';
import { Carv2DeleteButton } from '../../../../../common/fragments/buttons/Carv2DeleteButton';
import { DavitButtonIcon, DavitButtonLabel } from '../../../../../common/fragments/buttons/DavitButton';
import { ControllPanelEditSub } from '../common/ControllPanelEditSub';
import { DavitLabelTextfield } from '../common/fragments/DavitLabelTextfield';
import { OptionField } from '../common/OptionField';

export interface ControllPanelEditActorProps {
    hidden: boolean;
}

export const ControllPanelEditActor: FunctionComponent<ControllPanelEditActorProps> = (props) => {
    const { hidden } = props;
    const {
        label,
        name,
        changeName,
        saveComponent,
        deleteComponent,
        textInput,
        updateActor,
        createAnother,
        id,
    } = useControllPanelEditActorViewModel();

    return (
        <ControllPanelEditSub key={id} label={label} hidden={hidden} onClickNavItem={saveComponent}>
            <div className="optionFieldSpacer">
                <OptionField label="Component - Name">
                    <DavitLabelTextfield
                        label="Name:"
                        placeholder="Component Name"
                        onChangeDebounced={(name: string) => changeName(name)}
                        onBlur={updateActor}
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

const useControllPanelEditActorViewModel = () => {
    const actorToEdit: ActorCTO | null = useSelector(editSelectors.actorToEdit);
    const dispatch = useDispatch();
    const textInput = useRef<Input>(null);

    useEffect(() => {
        // check if component to edit is really set or gos back to edit mode
        if (DavitUtil.isNullOrUndefined(actorToEdit)) {
            handleError('Tried to go to edit component without componentToedit specified');
            EditActions.setMode.edit();
        }
        // used to focus the textfield on create another
        textInput.current!.focus();
    }, [actorToEdit]);

    const changeName = (name: string) => {
        const copyComponentToEdit: ActorCTO = DavitUtil.deepCopy(actorToEdit);
        copyComponentToEdit.actor.name = name;
        dispatch(EditActions.setMode.editActor(copyComponentToEdit));
    };

    const updateActor = () => {
        const copyComponentToEdit: ActorCTO = DavitUtil.deepCopy(actorToEdit);
        dispatch(EditActions.actor.save(copyComponentToEdit));
    };

    const saveActor = (newMode?: string) => {
        if (!DavitUtil.isNullOrUndefined(actorToEdit)) {
            if (actorToEdit?.actor.name !== '') {
                dispatch(EditActions.actor.save(actorToEdit!));
            } else {
                deleteActor();
            }
            dispatch(EditActions.setMode.edit());
        }
    };

    const createAnother = () => {
        dispatch(EditActions.setMode.editActor());
    };

    const deleteActor = () => {
        dispatch(EditActions.actor.delete(actorToEdit!));
        dispatch(EditActions.setMode.edit());
    };

    const setGroup = (group: GroupTO | undefined) => {
        if (!DavitUtil.isNullOrUndefined(actorToEdit)) {
            const copyComponentToEdit: ActorCTO = DavitUtil.deepCopy(actorToEdit);
            if (group !== undefined) {
                copyComponentToEdit.actor.groupFks = group.id;
            } else {
                copyComponentToEdit.actor.groupFks = -1;
            }
            dispatch(EditActions.setMode.editActor(copyComponentToEdit));
        }
    };

    return {
        label: 'EDIT * ' + (actorToEdit?.actor.name || ''),
        name: actorToEdit?.actor.name,
        changeName,
        saveComponent: saveActor,
        deleteComponent: deleteActor,
        textInput,
        setGroup,
        compGroup: actorToEdit?.actor.groupFks !== -1 ? actorToEdit?.actor.groupFks : undefined,
        updateActor,
        createAnother,
        id: actorToEdit?.actor.id || -1,
    };
};
