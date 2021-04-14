import React, {CSSProperties} from 'react';
import {IconThemeMode} from './IconThemeMode';
import {IconActorAdd} from './IconActorAdd';
import {IconActorEdit} from './IconActorEdit';
import {IconActorRemove} from './IconActorRemove';
import {IconActorSearch} from './IconActorSearch';
import {IconActorDuplicate} from './IconActorDuplicate';

export const availableIcons = {
	'theme-mode': 'theme-mode',
	'actor-add': 'actor-add',
	'actor-edit': 'actor-edit',
	'actor-remove': 'actor-remove',
	'actor-search': 'actor-search',
	'actor-duplicate': 'actor-duplicate',
};

export interface IconProps {
	/**
	 * The icon name dynamically identifies the expected  <Icon...>
	 */
	name: keyof typeof availableIcons,
	/**
	 * Inherit the font-size of the parent element. The size is used to set height and width of the icon.
	 */
	size?: string | '1em' | '100%',
	/**
	 * Inherit the color of the parent element
	 */
	color?: string | 'inherit',
	/**
	 * Moves the icon down the vertical axis
	 */
	verticalOffset?: number
	/**
	 * Custom style definition
	 */
	style?: CSSProperties;
}

export const Icon: React.FC<IconProps> = ({
	name,
	size = '1em',
	color = 'currentColor',
	style,
	verticalOffset = 0
}: IconProps) => {
		switch(name) {
			case 'theme-mode':
				return <IconThemeMode color={color} size={size} verticalOffset={verticalOffset} style={style} />;
			case 'actor-add':
				return <IconActorAdd color={color} size={size} verticalOffset={verticalOffset} style={style} />;
			case 'actor-edit':
				return <IconActorEdit color={color} size={size} verticalOffset={verticalOffset} style={style} />;
			case 'actor-remove':
				return <IconActorRemove color={color} size={size} verticalOffset={verticalOffset} style={style} />;
			case 'actor-search':
				return <IconActorSearch color={color} size={size} verticalOffset={verticalOffset} style={style} />;
			case 'actor-duplicate':
				return <IconActorDuplicate color={color} size={size} verticalOffset={verticalOffset} style={style} />;
			default:
				return <IconActorAdd color={color} size={size} verticalOffset={verticalOffset} style={style} />;
		}
};