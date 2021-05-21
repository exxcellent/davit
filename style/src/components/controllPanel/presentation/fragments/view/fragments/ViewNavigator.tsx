import React, { FunctionComponent } from 'react';
import { DavitButton } from '../../../../../common/fragments/buttons/DavitButton';
import { faFastBackward } from '@fortawesome/free-solid-svg-icons/faFastBackward';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons/faArrowRight';
import { faFastForward } from '@fortawesome/free-solid-svg-icons/faFastForward';
import { CenteredFlex } from '../../../../../common/fragments/CenteredFlex';

interface ViewNavigatorProps {
    fastBackward: () => void,
    fastForward: () => void,
    backward: () => void,
    forward: () => void,
    index: string,
}

export const ViewNavigator: FunctionComponent<ViewNavigatorProps> = (props) => {
    const { fastBackward, fastForward, backward, forward, index } = props;

    return (
        <CenteredFlex>
            <DavitButton
                iconName={faFastBackward}
                onClick={fastBackward}
                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                className={"padding"}
            />
            <DavitButton
                iconName={faArrowLeft}
                label='BACK'
                onClick={backward}
                iconLeft={true}
                style={{ borderRadius: 0 }}
            />
            <div className={'border'} style={{textAlign: "center", padding: "0.55em", borderRadius: 0}}>
                <label>{index}</label>
            </div>
            <DavitButton
                iconName={faArrowRight}
                label='NEXT'
                onClick={forward}
                style={{ borderRadius: 0 }}
            />
            <DavitButton
                iconName={faFastForward}
                onClick={fastForward}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            />
        </CenteredFlex>
    );
};
