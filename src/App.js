import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import MyDiagram from './Components/MyDiagram';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton> */}
            <Typography variant="title" color="inherit">
              GoJs
            </Typography>
          </Toolbar>
        </AppBar>
        <MyDiagram />
      </div>
    );
  }
}

export default App;
