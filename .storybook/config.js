import { configure, addDecorator } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.(js|tsx)$/);
function loadStories() {
  addDecorator(withInfo);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
