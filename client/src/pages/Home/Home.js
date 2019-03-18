import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Blog from './Blog';

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>

        <Link to={'/dashboard'}>
          Admin
        </Link>

        <Blog />
      </div>
    )
  }
}

export default Home
