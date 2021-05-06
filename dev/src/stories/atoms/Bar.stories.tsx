import React from 'react';
import { Story, Meta } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import { backgrounds } from '../shared/styles';

import {Bar, BarProps, availableBarColors, PrimaryBar, SecondaryBar, TertiaryBar} from '../../components/exxcellent-components/atoms';

const barList = Array.from(Object.keys(availableBarColors)).sort();

export default {
  title: 'Atoms/Bar',
  component: Bar,
  parameters: {
    backgrounds: backgrounds
  },
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: barList,

      }
    },
    height: { control: 'select', options: ['large', 'medium', 'small'] },
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

const Template: Story<BarProps> = (args ) => <Bar {...args}/>;


export const BasicBar = Template.bind({});
BasicBar.parameters = figmaDesign;
BasicBar.args = {
  color: 'primary',
  height: 'large',
  left: 'Left',
  right: 'Right',
  middle: 'Middle',
};

export const BarWithChildren = () => (
  <Bar color={'primary'} height={'large'}>
    <h1>Headline</h1>
    <p>Paragraph <span>with Text</span></p>
    <p>Other Paragraph<br/><span>with linebreak</span></p>
  </Bar>
);

export const BarOverview = () => (
  <>
    <table style={{ width: '100%' }}>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'primary'} height={'large'} left={<span>{ 'color="primary"' }</span>} right={<span>{ 'height="large"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'primary'} height={'medium'} left={<span>{ 'color="primary"' }</span>} right={<span>{ 'height="medium"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'primary'} height={'small'} left={<span>{ 'color="primary"' }</span>} right={<span>{ 'height="small"' }</span>} />
        </td>
      </tr>

      <tr>
        <td className={'padding-s'}>
          <Bar color={'secondary'} height={'large'} left={<span>{ 'color="secondary"' }</span>} right={<span>{ 'height="large"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'secondary'} height={'medium'} left={<span>{ 'color="secondary"' }</span>} right={<span>{ 'height="medium"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'secondary'} height={'small'} left={<span>{ 'color="secondary"' }</span>} right={<span>{ 'height="small"' }</span>} />
        </td>
      </tr>

      <tr>
        <td className={'padding-s'}>
          <Bar color={'tertiary'} height={'large'} left={<span>{ 'color="tertiary"' }</span>} right={<span>{ 'height="large"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'tertiary'} height={'medium'} left={<span>{ 'color="tertiary"' }</span>} right={<span>{ 'height="medium"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'tertiary'} height={'small'} left={<span>{ 'color="tertiary"' }</span>} right={<span>{ 'height="small"' }</span>} />
        </td>
      </tr>

      <tr>
        <td className={'padding-s'}>
          <Bar color={'none'} height={'large'} left={<span>{ 'color="none"' }</span>} right={<span>{ 'height="large"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'none'} height={'medium'} left={<span>{ 'color="none"' }</span>} right={<span>{ 'height="medium"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar color={'none'} height={'small'} left={<span>{ 'color="none"' }</span>} right={<span>{ 'height="small"' }</span>} />
        </td>
      </tr>
    </table>


  </>
);

export const SpecificBarTypes = () => (
  <>
    <table style={{ width: '100%' }}>
      <tr>
        <td className={'padding-s'}>
          <PrimaryBar height={'large'} left={<span>&lt;PrimaryBar /&gt;</span>} right={<span>{ 'height="large"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <PrimaryBar height={'medium'} left={<span>&lt;PrimaryBar /&gt;</span>} right={<span>{ 'height="medium"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <PrimaryBar height={'small'} left={<span>&lt;PrimaryBar /&gt;</span>} right={<span>{ 'height="small"' }</span>} />
        </td>
      </tr>

      <tr>
        <td className={'padding-s'}>
          <SecondaryBar height={'large'} left={<span>&lt;SecondaryBar /&gt;</span>} right={<span>{ 'height="large"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <SecondaryBar height={'medium'} left={<span>&lt;SecondaryBar /&gt;</span>} right={<span>{ 'height="medium"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <SecondaryBar height={'small'} left={<span>&lt;SecondaryBar /&gt;</span>} right={<span>{ 'height="small"' }</span>} />
        </td>
      </tr>

      <tr>
        <td className={'padding-s'}>
          <TertiaryBar height={'large'} left={<span>&lt;TertiaryBar /&gt;</span>} right={<span>{ 'height="large"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <TertiaryBar height={'medium'} left={<span>&lt;TertiaryBar /&gt;</span>} right={<span>{ 'height="medium"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <TertiaryBar height={'small'} left={<span>&lt;TertiaryBar /&gt;</span>} right={<span>{ 'height="small"' }</span>} />
        </td>
      </tr>

      <tr>
        <td className={'padding-s'}>
          <Bar height={'large'} left={<span>&lt;Bar /&gt;</span>} right={<span>{ 'height="large"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar height={'medium'} left={<span>&lt;Bar /&gt;</span>} right={<span>{ 'height="medium"' }</span>} />
        </td>
      </tr>
      <tr>
        <td className={'padding-s'}>
          <Bar height={'small'} left={<span>&lt;Bar /&gt;</span>} right={<span>{ 'height="small"' }</span>} />
        </td>
      </tr>
    </table>


  </>
);