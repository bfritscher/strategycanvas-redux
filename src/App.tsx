import React, { useState } from 'react';
import withRoot from './withRoot';
import { Button, Box, Container, Typography } from '@material-ui/core';
import TodoList from './TodoList';
import Chart from './Chart';
import Legends from './components/legends/Legends';
import * as models from './models/Chart';
import EditTitleDialog from './components/dialogs/EditTitleDialog';

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isOpenTitleDialog, setOpenTitleDialog] = useState(false);
  const [chart, setChart] = useState(new models.Chart({
    title: 'test chart',
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

  function handleEditTitleClose(e:any, reason:string, payload:any) {
    if (reason === 'save') {
      chart.title = payload;
      setChart(chart);
    }
    setOpenTitleDialog(false);
  }

  return (
    <Container>
      <header>
        <Typography onClick={() => {setOpenTitleDialog(true)}} variant="h4" component="h1">
          {chart.title}
        </Typography>
        <EditTitleDialog value={chart.title} open={isOpenTitleDialog} onClose={handleEditTitleClose} />
      </header>
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
