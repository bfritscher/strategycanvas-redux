import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import EditTitleDialog from '../src/components/dialogs/EditTitleDialog';


storiesOf('Dialogs', module)
  .add('EditTitleDialog open', () => <EditTitleDialog open={true} value="Some title" onClose={action('closed')} />)
  .add('EditTitleDialog closed', () => <EditTitleDialog open={false} />,
  { info: { inline: true } });
