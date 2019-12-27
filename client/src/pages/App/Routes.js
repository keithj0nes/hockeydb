import React, { Component } from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';


import Home from '../Home/Home';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../../components/Login';
import Players from '../Players/Players';
import Games from '../Games/Games';
import { Modal } from '../../components';

import { loginFromCookie } from '../../redux/actions/auth';


class Routes extends Component {
    render(){
        return (
            <div>
            <Route exact path="/"   component={Home} />
            <Route path='/login'    component={Login} />
            <Route path='/players'  component={Players} />
            <Route path='/games'    component={Games} />
            <PrivateRoute path='/dashboard' authenticated={this.props.isUserLoggedIn} component={Dashboard} />
            <Modal />
            </div>
        )
    }
}



const PrivateRoute = ({ component: Component, ...rest }) => {
  
    console.log(rest, 'rest!');

  return <Route {...rest} render={(props) =>  {

    console.log(props.location, 'props')

    return rest.authenticated
      ? <Component {...props} />
      : <Redirect             to={{
        pathname: "/login",
        state: { from: props.location }
      }} />
      
      }
    }/>

  }

const mapStateToProps = state => ({
  isUserLoggedIn: state.user && state.user.isUserLoggedIn
})

// const mapStateToProps = state => {
//   return {
//     isUserLoggedIn: state.user && state.user.isUserLoggedIn
//   }
// }

const mapDispatchToProps = dispatch => ({
  loginFromCookie: () => dispatch(loginFromCookie()),
//   toggleModal: () => dispatch(toggleModal(200, 'opening from app.js'))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));