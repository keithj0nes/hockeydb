import superagent from "superagent";
import querystring from "querystring";
import React from "react";
import { LoginContext } from "./context.js";

// import '../../styles/login.scss';

const API = 'http://localhost:8010';
// const API = "https://javascript-401-api.herokuapp.com";

const If = props => {
  return !!props.condition ? props.children : null;
};

class Login extends React.Component {


  state = {
    username: 'seramurt@gmail.com',
    password: 'tann09'
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e, loginMethodFromContext) => {
    e.preventDefault();
    superagent
      .post(`${API}/api/auth/login`, { email: this.state.username, password: this.state.password })
      // .auth(this.state.username, this.state.password)
      .then(response => {
        console.log(response, ' 🔥');

        let token = response.text;
        loginMethodFromContext(token);
      })
      .catch(console.error);
  };

  logout = (e, logoutMethodFromProvider) => {
    logoutMethodFromProvider();
  };

  render() {
    return (
      <LoginContext.Consumer>
        {context => {
          console.log("CTX", context);
          return (
            <div>
              <If condition={context.loggedIn}>
                <button className='logout-btn' onClick={e => this.logout(e, context.logout)}>
                  Log Out
                </button>
              </If>
              <If condition={!context.loggedIn}>
                <div className="form">
                  <form onSubmit={e => this.handleSubmit(e, context.login)}>
                    <h1>Login</h1>
                    <div className='inputs'>
                      <input
                        placeholder="username"
                        name="username"
                        onChange={this.handleChange}
                        value={this.state.username}
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
        }}
      </LoginContext.Consumer>
    );
  }
}

export default Login;
