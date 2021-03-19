import React, { FunctionComponent } from 'react';
import { DnDBox, DnDBoxType } from '../DnDBox';
import { PositionTO } from '../../../../dataAccess/access/to/PositionTO';
import { DavitModal } from './DavitModal';

interface DavitDraggableModalProps {
    form: JSX.Element
}

export const DavitDraggableModal: FunctionComponent<DavitDraggableModalProps> = (props) => {
    const { form } = props;

    return (
        <DavitModal>
            <DnDBox
                onPositionUpdate={() => {}}
                toDnDElements={[
                    {
                        element: form,
                        position: new PositionTO(),
                        // TODO: center modal if possible
                        // position: new PositionTO(30, 30),
                    },
                ]}
                svgElements={[]}
                zoomIn={() => {}}
                zoomOut={() => {}}
                type={DnDBoxType.fullscreen}
            />
        </DavitModal>
    );
};
