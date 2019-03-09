import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from '../Home/Home';
import Admin from '../Admin/Admin';

import './App.scss';

class App extends Component {

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path='/admin' component={Admin} />
        </div>
      </Router>
    );
  }
}

export default App;
