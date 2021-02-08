import React, { FunctionComponent } from "react";
import { Card } from "semantic-ui-react";
import { ActorCTO } from "../../../../dataAccess/access/cto/ActorCTO";
import { createViewFragment, ViewFragmentProps } from "../../../../viewDataTypes/ViewFragment";

export interface MetaActorFragmentProps {
    id: number;
    initName: string;
    initColor: string;
    initWidth?: number;
    initHeigth?: number;
    dataFragments: ViewFragmentProps[];
    onClick?: (id: number) => void;
}

export const MetaActorFragment: FunctionComponent<MetaActorFragmentProps> = (props) => {
    const { initName, dataFragments, initWidth, initHeigth } = props;

    return (
        <Card
            raised
            style={{ width: initWidth, height: initHeigth, fontSize: "0.7em" }}
            onClick={props.onClick ? () => props.onClick!(props.id) : undefined}>
            <Card.Content header={initName}></Card.Content>
            {dataFragments.map(createViewFragment)}
        </Card>
    );
};

export const createMetaActorFragment = (
    actorCTO: ActorCTO,
    actorDatas: ViewFragmentProps[],
    onClick?: (id: number) => void,
) => {
    return (
        <MetaActorFragment
            id={actorCTO.actor.id}
            initName={actorCTO.actor.name}
            initColor={actorCTO.design.color}
            initWidth={actorCTO.geometricalData.geometricalData.width}
            initHeigth={actorCTO.geometricalData.geometricalData.height}
            dataFragments={actorDatas}
        />
    );
};
