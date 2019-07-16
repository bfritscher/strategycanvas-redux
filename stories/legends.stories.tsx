import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import * as models from '../src/models/Chart';
import Marker from '../src/components/legends/Marker';
import Legend from '../src/components/legends/Legend';
import'../src/Chart.css';

const serie:models.Serie= {
  business: 'Company 1',
  color: 'red',
  dash: '0',
  offerings: {},
  symbol: 'circle'
}

storiesOf('Legends', module)
  .add('Marker', () => <Marker serie={serie} onClick={action('click')} />,
  { info: { inline: true } })
  .add('Legend', () => (
    <div id="legends">
      <Legend serie={serie} />
    </div>
    ),
  { info: { inline: true } })
  .add('Legend selected', () => (
    <div id="legends">
      <Legend serie={serie} selected={true} />
    </div>
    ),
  { info: { inline: true } });
