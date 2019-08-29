import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
// import { loginFromCookie } from '../../redux/actions/auth';

import Home from '../Home/Home';
import Dashboard from '../Dashboard/Dashboard';
import Login from '../../components/Login';
import Players from '../Players/Players';
import Games from '../Games/Games';
import { Modal } from '../../components';

// import Routes from './Routes';


// for demoing 
// import { toggleModal } from '../../redux/actions/misc';

import './App.scss';

class App extends Component {

  // async componentDidMount() {
  //   await this.props.loginFromCookie();
  // }

  //{/* <button onClick={this.props.toggleModal}>toggle modal!</button> */}

  render() {

    // console.log('redering')
    return (
      <Router>
        {/* <Routes /> */}
        <div>
          <Route exact path="/"   component={Home} />
          <Route path='/login'    component={Login} />
          <Route path='/players'  component={Players} />
          <Route path='/games'    component={Games} />
          <PrivateRoute path='/dashboard' authenticated={this.props.isUserLoggedIn} component={Dashboard} />
          <Modal />
        </div>
      </Router>
    );
  }
}


// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//     rest.authenticated
//       ? <Component {...props} />
//       : <Redirect to={'/login'} />
//   )} />
// )

const PrivateRoute = ({ component: Component, ...rest }) => {
  
    // console.log(rest);

  return <Route {...rest} render={(props) =>  {

    // console.log(props.location, 'props')

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
  // loginFromCookie: () => dispatch(loginFromCookie()),
  // toggleModal: () => dispatch(toggleModal(200, 'opening from app.js'))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default App;
