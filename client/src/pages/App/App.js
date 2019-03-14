import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginFromCookie } from '../../redux/actions/actions';

import Home from '../Home/Home';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../../components/auth/Login';

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
            <Route path='/login' component={Login} />
            <PrivateRoute path='/dashboard' authenticated={this.props.isUserLoggedIn} component={Dashboard} />
          </div>
        </Router>
    );
  }
}


const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
      rest.authenticated 
        ? <Component {...props} />
        : <Redirect to={'/login'} />
    )} />
)


const mapStateToProps = state => ({
  isUserLoggedIn: state.user && state.user.isUserLoggedIn
})

// const mapStateToProps = state => {
//   return {
//     isUserLoggedIn: state.user && state.user.isUserLoggedIn
//   }
// }

const mapDispatchToProps = dispatch => ({
  loginFromCookie: () => dispatch(loginFromCookie())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
