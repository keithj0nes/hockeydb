import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginFromCookie } from '../../redux/actions/actions';

import Home from '../Home/Home';
import Admin from '../Admin/Admin';

import './App.scss';

class App extends Component {

  async componentDidMount(){
    await this.props.loginFromCookie();
  }

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

const mapStateToProps = state => {
  // console.log(state, 'state in app.js')
  return {
    isUserLoggedIn: state.user && state.user.isUserLoggedIn
  }
}

const mapDispatchToProps = dispatch => ({
  loginFromCookie: () => dispatch(loginFromCookie())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
