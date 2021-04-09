import React, { FunctionComponent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataInstanceTO } from '../../../dataAccess/access/to/DataInstanceTO';
import { EditActions } from '../../../slices/EditSlice';
import { Filter, SequenceModelActions, sequenceModelSelectors } from '../../../slices/SequenceModelSlice';
import { createViewFragment, ViewFragmentProps } from '../../../viewDataTypes/ViewFragment';
import { DavitCardButton } from './buttons/DavitCardButton';
import { DavitIcons } from '../IconSet';
import { DavitShowMoreButton } from './buttons/DavitShowMoreButton';

/**
 *  Prop: initWidth / initHeight
 *  This is the default size of a card in this case.
 *  If the card's child shrinks, the card it self needs a default size to fall back.
 */
export interface DavitCardProps {
    id: number;
    initName: string;
    initWidth: number;
    initHeigth: number;
    dataFragments: ViewFragmentProps[];
    instances?: DataInstanceTO[];
    zoomFactor: number;
    onClick?: (id: number) => void;
    type: "DATA" | "ACTOR" | "INSTANCE";
}

export const DavitCard: FunctionComponent<DavitCardProps> = (props) => {
    const {id, initName, initWidth, initHeigth, dataFragments, instances, zoomFactor, type} = props;

    const {onClickEdit, onClickFilter, showMenu, setShowMenu, isActiveFilter} = useDavitCardViewModel(type, id);

    const createInstances = (id: number, instanceName: string, actors: ViewFragmentProps[]) => {
        return (
            <DavitCard
                id={id}
                initName={instanceName}
                dataFragments={actors}
                initWidth={initWidth}
                initHeigth={initHeigth}
                zoomFactor={zoomFactor}
                key={id}
                type="INSTANCE"
            />
        );
    };

    return (
        <div
            className={isActiveFilter ? "activeFilter card" : "card"}
            style={{
                minWidth: initWidth * zoomFactor,
                minHeight: initHeigth * zoomFactor,
                fontSize: `${zoomFactor}em`,
            }}
            onClick={props.onClick ? () => props.onClick!(props.id) : undefined}
            key={id}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}>
                <div className={showMenu ? "cardHeaderButtons" : "cardHeader"}>
                    <div className={showMenu ? "carhHeaderTextInvisible" : "cardHeaderText"}>{initName}</div>
                    {showMenu && (
                        <div style={{display: "flex", justifyContent: "flex-end"}}>
                            <DavitCardButton icon={DavitIcons.wrench} onClick={() => onClickEdit(id, type)}/>
                            <DavitCardButton
                                icon={DavitIcons.filter}
                                onClick={() => onClickFilter(id, type)}
                                isActive={isActiveFilter}
                            />
                        </div>
                    )}
                </div>
                <DavitShowMoreButton className={"Carv2CardMainButton"} onClick={() => {
                        setShowMenu(!showMenu);
                }}/>
            </div>
            {instances && (
                <div style={{display: "flex", alignItems: "start"}}>
                    {instances.map((instance, index) =>
                        createInstances(
                            index,
                            instance.name,
                            dataFragments.filter(
                                (actor) =>
                                    (actor.parentId as {
                                        dataId: number;
                                        instanceId: number;
                                    }).instanceId === instance.id,
                            ),
                        ),
                    )}
                </div>
            )}
            {(instances === undefined || instances?.length === 0) && dataFragments.map(createViewFragment)}
        </div>
    );
};

const useDavitCardViewModel = (type: "DATA" | "ACTOR" | "INSTANCE", id: number) => {
    const activeFilters: Filter[] = useSelector(sequenceModelSelectors.activeFilters);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const dispatch = useDispatch();

    const onClickEdit = (currentId: number, currentType: "DATA" | "ACTOR" | "INSTANCE") => {
        switch (currentType) {
            case "ACTOR":
                dispatch(EditActions.setMode.editActorById(currentId));
                break;
            case "DATA":
                dispatch(EditActions.setMode.editDataById(currentId));
                break;
            case "INSTANCE":
                dispatch(EditActions.setMode.editInstanceById(currentId));
        }
        setShowMenu(false);
    };
    const onClickFilter = (currentId: number, currentType: "DATA" | "ACTOR" | "INSTANCE") => {
        switch (currentType) {
            case "ACTOR":
                if (isActiveFilter) {
                    dispatch(SequenceModelActions.removeActorFilter(currentId));
                    setShowMenu(false);
                } else {
                    dispatch(SequenceModelActions.addActorFilters(currentId));
                }
                break;
            case "DATA":
            case "INSTANCE":
                if (isActiveFilter) {
                    dispatch(SequenceModelActions.removeDataFilters(currentId));
                    setShowMenu(false);
                } else {
                    dispatch(SequenceModelActions.addDataFilters(currentId));
                }
                break;
        }
    };

    const isActiveFilter = activeFilters.some(
        (filter) => (filter.type === type || (filter.type === "DATA" && type === "INSTANCE")) && filter.id === id,
    );

    return {
        onClickEdit,
        onClickFilter,
        showMenu,
        setShowMenu,
        isActiveFilter: isActiveFilter,
    };
};
