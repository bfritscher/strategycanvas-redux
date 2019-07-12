import React, { useState } from 'react';
import logo from './logo.svg';
import withRoot from './withRoot';
import { Button, Box, Container, Link, Typography } from '@material-ui/core';
import ProTip from './ProTip';
import TodoList from './TodoList';
import Chart from './Chart';


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

  const handleButton = () => {
    setCount(currentCount => currentCount + 1);
  };

  return (
    <Container>
      <Chart />
      <Box my={4}>
        <Button variant="contained" color="primary" onClick={handleButton}>
          Clicked {count}
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Create React App v4-beta example with TypeScript
        </Typography>
        <img src={logo} className="App-logo" alt="logo" />
        <MadeWithLove />
        <TodoList />
        <ProTip />

      </Box>
    </Container>
  );
};

export default withRoot(App);
