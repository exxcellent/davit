import React, { FunctionComponent } from 'react';

interface ViewPlaceholderProps {
    text: string
    className?: string
}

export const ViewPlaceholder: FunctionComponent<ViewPlaceholderProps> = (props) => {
    const { text, className } = props;

    // const [mouseOver, setMouseOver] = useState<boolean>(false);

    return (
        <div className={className}>
            <div className={'viewPlaceholder'}>
                {/*onMouseEnter={() => setMouseOver(true)}*/}
                {/*onMouseLeave={() => setMouseOver(false)}*/}
                <h2>{text}</h2>
            </div>
        </div>
    );
};
