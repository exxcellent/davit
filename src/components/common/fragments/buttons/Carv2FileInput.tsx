import React, { createRef, FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { GlobalActions } from '../../../../slices/GlobalSlice';
import { DavitButtonIcon } from './DavitButton';

export interface Carv2FileInputProps {}

export const Carv2FileInput: FunctionComponent<Carv2FileInputProps> = (props) => {
    const dispatch = useDispatch();
    const inputFileRef = createRef<HTMLInputElement>();

    const openFileBrowser = () => {
        if (inputFileRef !== null && inputFileRef.current !== null) {
            inputFileRef.current.click();
        }
    };

    const readFileToString = (file: File | null) => {
        const fileReader = new FileReader();
        if (file !== null) {
            fileReader.readAsText(file);
            fileReader.onload = (event) => {
                dispatch(GlobalActions.storefileData(event.target!.result as string));
            };
        }
    };

    return (
        <div>
            <DavitButtonIcon icon="cloud upload" onClick={openFileBrowser} />
            <input
                hidden={true}
                ref={inputFileRef}
                type="file"
                onChange={(event) => {
                    if (event.target.files !== null) {
                        readFileToString(event.target.files[0]);
                    }
                }}
            />
        </div>
    );
};
