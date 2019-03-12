import superagent from "superagent";
import querystring from "querystring";
import React from "react";
import { connect } from "react-redux";
import { LoginContext } from "./context.js";
import axios from 'axios';

import { login } from '../../redux/actions';


// import '../../styles/login.scss';

const API = 'http://localhost:8010';
// const API = "https://javascript-401-api.herokuapp.com";

const If = props => {
  return !!props.condition ? props.children : null;
};

class Login extends React.Component {


  state = {
    email: 'seramurt@gmail.com',
    password: 'tann09'
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.login(this.state)


  };

  logout = (e, logoutMethodFromProvider) => {
    logoutMethodFromProvider();
  };

  render() {
    // return (
    // <LoginContext.Consumer>
    //   {context => {
    //     console.log("CTX", context);
    return (
      <div>
        <If condition={this.props.isUserLoggedIn}>
          <button className='logout-btn' onClick={e => this.logout(e)}>
            Log Out
                </button>
        </If>
        <If condition={!this.props.isUserLoggedIn}>
          <div className="form">
            <form onSubmit={e => this.handleSubmit(e)}>
              <h1>Login</h1>
              <div className='inputs'>
                <input
                  placeholder="email"
                  name="email"
                  onChange={this.handleChange}
                  value={this.state.email}
                />
                <input
                  placeholder="password"
                  name="password"
                  type="password"
                  onChange={this.handleChange}
                  value={this.state.password}
                />
                <input className='btn' type="submit" value="login" />
              </div>
            </form>
          </div>
        </If>

      </div>
    );
  }
}
// </LoginContext.Consumer>
// );
// }
// }


const mapStateToProps = state => ({
  user: state.user && state.user.user,
  isUserLoggedIn: state.user && state.user.isUserLoggedIn,
})

// const mapStateToProps = state => {
//   console.log(state, 'STATEEE')
//   return {}
//   // user: state && console.log(state, 'STATE!!!f')
// }


const mapDispatchToProps = dispatch => ({
  login: loginData => dispatch(login(loginData)),
})



export default connect(mapStateToProps, mapDispatchToProps)(Login);
