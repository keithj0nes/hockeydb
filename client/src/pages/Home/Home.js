import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import News from './News';

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>

        <Link to={'/dashboard'}>
          Admin
        </Link>

        <News />
      </div>
    )
  }
}

export default Home
