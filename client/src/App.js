import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';

class App extends Component {

  state = {
    users: []
  }

  async componentDidMount() {
    const data = await axios.get('/api/start');
    console.log(data.data, 'data')
    this.setState({ users: data.data.users })
  }

  handleUser = async () => {
    const user = {
      first_name: 'tanner',
      last_name: 'smith',
      email: 'tanner@smitherines.com'
    }
    const data = await axios.post('/api/admins', user)
    if (data.data.error) return alert(data.data.message)
    const users = [...this.state.users, data.data.user];

    this.setState({ users })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />


          {this.state.users.length > 0 && this.state.users.map(user => <p key={user.id}>{user.first_name} {user.last_name} - {user.email}</p>)}

          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>


          <button onClick={this.handleUser}>create user</button>
        </header>
      </div>
    );
  }
}

export default App;
