import React, {CSSProperties, ReactNode} from 'react';
import './Bar.css';

export const availableBarColors = {
	'primary': 'primary',
	'secondary': 'secondary',
	'tertiary': 'tertiary',
	'none': 'none',
};

export interface BarProps {
	/**
	 * The color dynamically identifies the expected  <...Bar>
	 */
	color?: keyof typeof availableBarColors,
	/**
	 * Predefined bar heights
	 */
	height?: 'large' | 'medium' | 'small',
	/**
	 * Predefined bar position: "left"  with aligned contents: "left"
	 */
	left?: ReactNode
	/**
	 * Predefined bar position: "middle" with aligned contents: "center"
	 */
	middle?: ReactNode
	/**
	 * Predefined bar position: "right" with aligned contents: "right"
	 */
	right?: ReactNode
	/**
	 * The React children are positioned between the "left" and the "middle" bar position.
	 */
	children?: ReactNode

	/**
	 * Custom style definition
	 */
	style?: CSSProperties;
}

export const Bar: React.FC<BarProps> = ({
	color = 'none',
	height = 'medium',
	left,
	middle,
	right,
	style,
	children,
	...props
}) => {
		return (
			<div className={['bar', color, height].join(" ")}>
				<div className={'bar-position left'}>
					{left}{children}
				</div>
				<div className={'bar-position middle'}>
					{middle}
				</div>
				<div className={'bar-position right'}>
					{right}
				</div>
			</div>
		);
};