import React, { useState } from 'react';
import logo from './logo.svg';
import withRoot from './withRoot';
import { Button, Box, Container, Link, Typography } from '@material-ui/core';
import ProTip from './ProTip';
import TodoList from './TodoList';
import Chart from './Chart';
import Legends from './Legends';
import * as models from './models/Chart';

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}



const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [chart, setChart] = useState(new models.Chart({
    factors: ['a', 'b', 'c', 'd', 'e'],
    editCode: true,
    series: [
      {
        business: 'abc',
        color: '#1f77b4',
        symbol: 'square',
        dash: '0',
        offerings: {
          a: 0.5,
          b: 1,
          c: 0.2
        }
      },
      {
        business: 'def',
        color: '#8f47b4',
        symbol: 'circle',
        dash: '1',
        offerings: {
          a: 0.2,
          c: 0.3,
          d: 0.5,
          e: 1
        }
      }
    ]
  }))

  const handleButton = () => {
    setCount(currentCount => currentCount + 1);
    setChart(chart);
  };

  return (
    <Container>
      <Legends chart={chart} />
      <Chart chart={chart}/>
      <Box my={4}>
        <Button variant="contained" color="primary" onClick={handleButton}>
          Clicked {count}
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create React App v4-beta example with TypeScript
        </Typography>
        <TodoList />
      </Box>
    </Container>
  );
};

export default withRoot(App);
