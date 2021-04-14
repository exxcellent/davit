import React from 'react';
import {Meta, Story} from '@storybook/react';
import {withDesign} from 'storybook-addon-designs';
import {backgrounds} from '../shared/styles';

import {
  Bar,
  BarProps,
  Card,
  CardProps,
  PrimaryBar,
  SecondaryBar,
  TertiaryBar
} from '../../components/exxcellent-components/atoms';

export default {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    backgrounds: backgrounds
  },
  argTypes: {

  },
  decorators: [withDesign],
} as Meta;

const figmaDesign = {
  design: {
    type: 'figma',
    url:
      'https://www.figma.com/file/Klm6pxIZSaJFiOMX5FpTul9F/storybook-addon-designs-sample',
  },
  controls: { hideNoControlsWarning: false },
};

const Template: Story<CardProps> = (args ) => <Card {...args}/>;


export const BasicCard = Template.bind({});
BasicCard.parameters = figmaDesign;
BasicCard.args = {
  children: 'Card'
};

export const NormalCard = Template.bind({});
NormalCard.parameters = figmaDesign;
NormalCard.args = {
  type: 'normal',
  style: { height: '300px', width: '300px' },
};

export const OutlinedCard = Template.bind({});
OutlinedCard.parameters = figmaDesign;
OutlinedCard.args = {
  type: 'outlined',
  style: { height: '300px', width: '300px' },
};
